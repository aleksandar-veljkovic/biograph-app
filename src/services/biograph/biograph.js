// Nodes
import EntityNode from "./nodes/entity-node";
import IdentifierNode from "./nodes/identifier-node";
import DataNode from "./nodes/data-node";

// Edges
import IdentifierEdge from "./edges/identifier-edge";
import DataEdge from "./edges/data-edge";
import BioGraphEdge from "./edges/biograph-edge";

import Utilities from "../../services/utilities/utilities";
import { FitScreen } from "@mui/icons-material";

class BioGraph {
	constructor(database) {
		this.database = database;
		this.imports = {};
	}

	startTransaction() {
		this.tx = this.database.startTransaction();
	}

	startNewImport() {
		// this.startTransaction();
		const importId = Utilities.generateId();
		this.imports[importId] = { identifiers: [], data: [], objects: [], edges: [] };
		return importId;
	}

	async executeImport(importId) {
		const { identifiers, data, objects, edges } = this.imports[importId];
		// fs.writeFileSync('/tmp/identifiers.json', JSON.stringify(identifiers, null, 2));

		
	}

	async commit() {
		try {
			await this.database.commitTransaction(this.tx);
		} catch (err) {
			console.log(err);
		}
		this.tx = null;
	}

	// Object node
	createEntity(entityType, id, importId) {
		const objNode = new EntityNode(entityType, id);
		const serialized = objNode.getSerialized();

		this.imports[importId].objects.push(serialized);

		// this.imports[importId].nodes.push(objNode.store(this.database, this.tx));

		return objNode.getKey();
	}

	// Identifier node
	createIdentifier(identifierType, title, value, targetObjectKey, importId) {
		const identifierNode = new IdentifierNode(identifierType, title, value);
		const identifierKey = identifierNode.getKey();

		const identifierEdge = new IdentifierEdge(identifierKey, targetObjectKey);

		this.imports[importId].identifiers.push(identifierNode.getSerialized());
		this.imports[importId].edges.push(identifierEdge.getSerialized());

		// this.imports[importId].nodes.push(identifierNode.store(this.database, this.tx));
		// this.imports[importId].edges.push(identifierEdge.store(this.database, this.tx));
	}

	// Data node
	createData(dataSource, dataObj, targetObjectKey, importId) {
		const dataNode = new DataNode(dataObj, targetObjectKey, dataSource);
		const dataKey = dataNode.getKey();

		const dataEdge = new DataEdge(dataKey, targetObjectKey);

		this.imports[importId].data.push(dataNode.getSerialized());
		this.imports[importId].edges.push(dataEdge.getSerialized());
	}

	// Custom edge
	createCustomEdge(fromObjectKey, toObjectKey, label, data={}, importId) {
		const edge = new BioGraphEdge([label], fromObjectKey, toObjectKey, data);

		this.imports[importId].edges.push(edge.getSerialized())

		// this.imports[importId].edges.push(edge.store(this.database, this.tx));		
	}

	async getObjectsById(idValue, idTitle=null) {
		const objects = await this.database.runQuery(`
			MATCH (o)-[r:HAS_ID]->(i:Identifier {${
				idTitle ? 'title: $title, '
			 : ''}
			${
				'value: $value'
			}}) RETURN o
		`, { title: idTitle, value: idValue });
		
		const objectPromises = objects.records.map(async (r) => {
			const { properties } = r._fields[0];
			const {primaryId, entityType} = properties;
			const obj = {id: primaryId, entityType, data: {}};

			const idQuery = `MATCH (o {_key: $_key})-[r:HAS_ID]->(i:Identifier) return i`;
			const idParams = { _key: properties._key };
			const identifiers = await this.database.runQuery(idQuery, idParams);

			obj.identifiers = identifiers.records.map(ir => {
				const { title, value} = ir._fields[0].properties;
				const idObj = {
					title,
					value,
				};
				return idObj;
			});

			const dataQuery = `MATCH (o {_key: $_key})-[r:HAS_DATA]->(d:Data) return d`;
			const dataParams = { _key: properties._key };
			const dataRecords = await this.database.runQuery(dataQuery, dataParams);

			dataRecords.records.forEach(dr => {
				const { properties } = dr._fields[0];
				const { dataSource } = properties;

				const dataObj = { ...properties };
				delete dataObj._key;
				delete dataObj.dataSource;
				delete dataObj.type;


				obj.data[dataSource] = dataObj;
			});

			return obj;
		});

		return Promise.all(objectPromises);
	}

	async getNodeByPrimaryId(id, entityType) {
		const entityTypeQuery = `SELECT e.entity_type FROM Entity e WHERE e.primary_id = '${id}' AND e.entity_type = '${entityType}'`;
		const entityRes = await this.database.client.query(entityTypeQuery);

		if (entityRes.rows.length == 0) {
			return null;
		}

		const { entity_type: nodeEntityType } = entityRes.rows[0];

		const identifiersQuery = `SELECT i.* FROM Entity e JOIN Edge ie on ie.from_vertex = e.vertex_id AND e.primary_id = '${id}' AND e.entity_type = '${entityType}' AND ie.edge_type = 'HAS_ID' JOIN Identifier i ON i.vertex_id = ie.to_vertex`;

		const idRes = await this.database.client.query(identifiersQuery);
		const identifiers = idRes.rows.reduce((prev, curr) => {
			prev[curr.identifier_title] = curr.identifier_value;
			return prev;
		}, {});

		const dataQuery = `SELECT d.* FROM DataNode d JOIN Entity e ON e.primary_id = '${id}' AND e.entity_type = '${entityType}' AND d.entity_id = e.id`;

		const dataRes = await this.database.client.query(dataQuery);
		const data = dataRes.rows.reduce((prev, curr) => {
			const { data_source, data } = curr;
			if (prev[data_source] == null) {
				prev[data_source] = {};
			}

			prev[data_source] = { ...prev[data_source], ...data };
			return prev;
		}, {});

		const neighborsQuery = `SELECT e2.primary_id, e2.entity_type, ee.edge_type FROM Entity e JOIN Edge ee ON e.primary_id = '${id}' AND e.entity_type = '${entityType}' AND (ee.from_vertex = e.id OR ee.to_vertex = e.id) JOIN Entity e2 ON (e2.id = ee.from_vertex OR e2.id = ee.to_vertex) AND e2.primary_id <> e.primary_id AND ee.edge_type <> 'HAS_ID'`;
		const neighborsRes = await this.database.client.query(neighborsQuery);
		const neighbors = neighborsRes.rows.map(neighbor => ({ id: neighbor.primary_id, entityType: neighbor.entity_type, edgeType: neighbor.edge_type }));


		return {
			id,
			entityType: nodeEntityType,
			identifiers,
			data,
			neighbors
		}
	}
}

export default BioGraph;