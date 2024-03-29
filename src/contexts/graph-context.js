import React, { createContext, useContext, useState } from "react";
import Utilities from "../services/utilities/utilities";
import { QueryContext } from "./query-context";
import availableNodeProperties from "./schemas/available-node-properties";

export const GraphContext = createContext();

const themes = {
		unselected: {
			color: 'gray',
			colorLight: '#aeaeae',
			icon: require('../assets/icons/gene-icon.png'),
		},
		Gene: {
			color: '#C894D5',
			colorLight: '#F8DBFF',
			icon: require('../assets/icons/gene-icon.png'),
		},
		Organism: {
			color: '#C894D5',
			colorLight: '#F8DBFF',
			icon: require('../assets/icons/gene-icon.png'),
		},
		Protein: {
			color: '#94D5A3',
			colorLight: '#DFFCE5',
			icon: require('../assets/icons/protein-icon.png'),
		},
		Disease: {
			color: '#E27171',
			colorLight: '#EF9494',
			icon: require('../assets/icons/disease-icon.png'),
		},
		Antigen: {
			color: '#e28e10',
			colorLight: '#fdbd5e',
			icon: require('../assets/icons/antigen-icon.png'),
		},
		Epitope: {
			color: '#e28e10',
			colorLight: '#fdbd5e',
			icon: require('../assets/icons/antigen-icon.png'),
		},
	}

const edgeSchema = {
	Protein: {
		ProteinFeature: [
			{
				edgeType: 'HAS_FEATURE',
				label: 'Protein has feature',
				properties: [],
			},
		],
		Antigen: [
			{
				edgeType: 'IS_ANTIGEN',
				label: 'Protein is antigen',
				properties: [],
			},
		],
		Organism: [
			{
				edgeType: 'FROM',
				label: 'Protein from organism',
				properties: [],
			},
		],
		Gene: [
			{
				edgeType: 'FROM',
				label: 'Protein from gene',
				properties: [],
			}
		]
	},
	Gene: {
		Antigen: [
			{
				edgeType: 'IS',
				label: 'Gene is antigen',
				properties: [],
			}
		],
		Organism: [
			{
				edgeType: 'FROM',
				label: 'Gene from organism',
				properties: [],
			},
		],
	},
	Antigen: {
		Antigen: [
			{
				edgeType: 'IS',
				label: 'Antigens are isoform',
				properties: [{
					value: 'equalityType',
					label: 'ISOFORM',
					isNumeric: true,
				}],
			},
			{
				edgeType: 'IS',
				label: 'Antigens are mutations',
				properties: [{
					value: 'equalityType',
					label: 'MUTATION_ENTRY',
					isNumeric: true,
				}],
			},
		],
		Organism: [
			{
				edgeType: 'FROM',
				label: 'Antigen from organism',
				properties: [],
			},
		],
		Epitope: [
			{
				edgeType: 'CONTAINS',
				label: 'Antigen contains epitope',
				properties: [],
			}
		],
		HLA_Ligand: [
			{
				edgeType: 'HAS_LIGAND',
				label: 'Antigen has ligand',
				properties: [],
			}
		]
	},
	ELM: {
		Protein: [
			{
				edgeType: 'IN_PROTEIN',
				label: 'ELM is in protein',
				properties: [],
			}
		],
		ELMClass: [
			{
				edgeType: 'FROM_ELM_CLASS',
				label: 'ELM from class',
				properties: [],
			}
		]
	},
	Disease: {
		Gene: [
			{
				edgeType: 'IS_RELATED_WITH',
				label: 'Disease related gene',
				properties: [
					{
						value: 'score',
						label: 'Relation Score',
						isNumeric: true,
					}
				],
			}
		],
		Organism: [
			{
				edgeType: 'FROM',
				label: 'Disease from organism',
				properties: [],
			},
		],
	},
	Organism: {},
	Epitope: {}
}

export const GraphContextProvider = ({ children }) => {
	const { currentQuery, rawQuery, clearResults } = useContext(QueryContext);
	const [nodes, setNodes] = useState([]);
	const [edges, setEdges] = useState([]);

	// Get node by ID
	const getNode = (nodeId) => {
		return nodes.find(n => n.id === nodeId);
	}

	// Create node
	const createNode = (x, y, label=null, entityType=null) => {
		const id = 'n' + Utilities.generateId();

		const node = {
			id,
			position: { x: x - 20, y: y - 20 },
			type: 'graphNode',
			data: {
				defaultLabel: 'node_' + id.substring(0, 5),
				label: null,
				isIncluded: true,
				properties: [],
				entityType: entityType || 'unselected',
			}
		}
		addNode(node);
	}
	
	// Add new node
	const addNode = (node) => {
		setNodes([...nodes, node]);
		setEdges([...edges.filter(edge => edge.source != node.id && edge.target != node.id)]);
	}

	// Update node
	const updateNode = (nodeId, updateObj, silent=false) => {
		const node = getNode(nodeId);

		const { data } = node;
		node.data = {...data, ...updateObj};
		rawQuery.current = JSON.stringify({ nodes, edges }, null, 2);

		console.log(silent)
		if (!silent) {
			setNodes([...nodes]);
		}
	}

	const addNodeProperty = (nodeId, field, operator, value) => {
		const node = getNode(nodeId);
		const { properties } = node.data;
		properties.push({ field, operator, value });
		updateNode(nodeId, { properties });
	}

	const updateNodeProperty = (nodeId, propertyIndex, field, operator, value, silent=false) => {
		const node = getNode(nodeId);
		const { properties } = node.data;
		const property = properties[propertyIndex];
		properties[propertyIndex] = { 
			...property, 
			...(field && { field }),
			...(operator && { operator }),
			...(value && { value }),
		};
		updateNode(nodeId, { properties }, silent);
	}

	const setNodeProperties = (nodeId, properties) => {
		updateNode(nodeId, { properties });
	}

	const removeNodeProperty = (nodeId, propertyIndex) => {
		const node = getNode(nodeId);
		const { properties } = node.data;
		properties.splice(propertyIndex, 1);
		updateNode(nodeId, { properties });
	}

	const toggleNodeIncluded = (nodeId) => {
		const node = getNode(nodeId);
		const { isIncluded } = node.data;
		updateNode(nodeId, { isIncluded: !isIncluded });
	}

	const setNodeEntityType = (nodeId, entityType) => {
		updateNode(nodeId, { entityType });
	}

	const setNodeLabel = (nodeId, label) => {
		updateNode(nodeId, { label });
	}

	// Remove existing node
	const removeNode = (nodeId) => {
		setEdges(edges.filter(e => e.source != nodeId && e.target != nodeId))
		setNodes([...nodes.filter(n => n.id != nodeId)]);
	}

	const getEdge = (edgeId) => {
		return edges.find(edge => edge.id === edgeId);
	}

	const createEdge = (params) => {
		const id = 'E' + Utilities.generateId();

		const edge = {
			...params, 
			id, 
			animated: true, 
			data: {
				properties: [],
				data: {},
				edgeType: null,
			},
			type: 'graphEdge',
			style: {
				strokeWidth: '3px', 
			},
			sourceNode: null,
			targetNode: null,
		};

		edge.sourceNode = getNode(edge.source);
		edge.targetNode = getNode(edge.target);

		console.log(edge);
		addEdge(edge);
	}

	const addEdge = (edge) => {
		setEdges([...edges, edge]);
	}

	const updateEdge = (edgeId, updateObj, silent=false) => {
		const edgeIndex = edges.findIndex(edge => edge.id == edgeId)
		const edge = edges[edgeIndex];
		const { data } = edge;
		edges[edgeIndex].data = {...data, ...updateObj};
		rawQuery.current = JSON.stringify({ nodes, edges }, null, 2);

		if (!silent) {
			setEdges([...edges]);
		}
	}

	const addEdgeProperty = (edgeId, field, operator, value) => {
		const edge = getEdge(edgeId);
		const { properties } = edge.data;
		properties.push({ field, operator, value});
		updateEdge(edgeId, { properties });
	}

	const updateEdgeProperty = (edgeId, propertyIndex, field, operator, value, silent=false) => {
		
		const edge = getEdge(edgeId);
		const { properties } = edge.data;
		const property = properties[propertyIndex];
		properties[propertyIndex] = { 
			...property, 
			...(field && { field }),
			...(operator && { operator }),
			...(value && { value }),
		};
		updateEdge(edgeId, { properties }, silent);
	}

	const removeEdgeProperty = (edgeId, propertyIndex) => {
		const edge = getEdge(edgeId);
		const { properties } = edge.data;
		properties.splice(propertyIndex, 1);
		updateEdge(edgeId, { properties });
	}

	const removeEdge = (edgeId) => {
		setEdges([...edges.filter(edge => edge.id != edgeId)]);
	}

	const setEdgeType = (edgeId, edgeType) => {
		updateEdge(edgeId, { edgeType });
	}

	const reverseEdge = (edgeId) => {
		const edge = getEdge(edgeId);
		const t = edge.source;
		const tt = edge.sourceNode;

		edge.source = edge.target;
		edge.sourceNode = edge.targetNode;

		edge.target = t;
		edge.targetNode = tt;

		edge.reversed = true;
		updateEdge(edgeId, {});
	}

	const loadFromQuery = (query) => {
		try {
			const parsedQuery = JSON.parse(query);
			if (parsedQuery.nodes != null && Array.isArray(parsedQuery.nodes)
			&& parsedQuery.edges != null && Array.isArray(parsedQuery.edges)) {
				setNodes(parsedQuery.nodes);
				setEdges(parsedQuery.edges);
			} else {
				throw new Error('Invalid query');
			}
		} catch (err) {
			return false;
		}

		return true;
	}

	const prepareQuery = () => {
		const match = [];
		const params = {};
		const labels = {}

		let numEdges = 0;
		
		for (const edge of edges) {
			const { sourceNode, targetNode, id: edgeId, data: { edgeType } } = edge;
			labels[sourceNode.data.defaultLabel] = sourceNode.data.label;
			labels[targetNode.data.defaultLabel] = targetNode.data.label;

			if (edgeType != null) {
				numEdges += 1;
				const pattern = `(${sourceNode.data.defaultLabel}:${sourceNode.data.entityType})-[${edgeId}:${edgeType}]-(${targetNode.data.defaultLabel}:${targetNode.data.entityType})`;
				match.push(pattern);

				const edgeProperties = [];
				for (const property of edge.data.properties) {
					const fromType = sourceNode.data.entityType;
					const toType = targetNode.data.entityType;
					const { isNumeric } = edgeSchema[fromType][toType].find(p => p.edgeType === edgeType) || {}
					edgeProperties.push({
						key: property.field,
						op: property.operator,
						isNumeric,
						value: isNumeric ? parseFloat(property.value) : property.value,
					});
				}

				params[edgeId] = {
					identifiers: [],
					data: edgeProperties,
				}
			}
		}

		const returns = nodes.filter(n => n.data.isIncluded).map(n => n.data.defaultLabel);
		if (returns.length == 0) {
			return;
		}

		let numNodes = 0;
		for (const node of nodes) {
				if (node.data.entityType == "unselected") {
				continue;
			}
			numNodes += 1;

			if (labels[node.data.defaultLabel] == null) {
				labels[node.data.defaultLabel] = node.data.label;
			}

			params[node.data.defaultLabel] = { identifiers: [], data: []};
			for (const property of node.data.properties) {
				const propertyInfo = availableNodeProperties[node.data.entityType].find(p => p.value === property.field);
				if (propertyInfo.identifier) {
					params[node.data.defaultLabel].identifiers.push({ value: property.value });
				} else {
					params[node.data.defaultLabel].data.push({ key: property.field, op: property.operator, isNumber: propertyInfo.isNumeric, value: propertyInfo.isNumeric ? parseFloat(property.value) : property.value, isNumeric: propertyInfo.isNumeric})
				}
			}
		}

		if (numNodes > 1 && numEdges < numNodes - 1) {
			console.log('All nodes need to be connected');
			return { query: null };
		}

		if (numNodes == 1 && numEdges == 0) {
			const singleNode = nodes[0];
			match.push(`(${singleNode.data.defaultLabel}:${singleNode.data.entityType})`)
		}

		const query = {
			match,
			returns,
			params,
			labels,
		}

		rawQuery.current = JSON.stringify({ nodes, edges });
		currentQuery.current = query;

		return { query, labels };
	}

	const clearGraph = () => {
		const res = window.confirm("Are you sure you want to start new query? All unsaved changes would be lost");
		if (res) {
			clearResults();
			setNodes([]);
			setEdges([]);
			rawQuery.current = JSON.stringify({ nodes, edges });
		}

		rawQuery.current = JSON.stringify({ nodes: [], edges: [] });
	}

	return (
		<GraphContext.Provider value={{
			availableNodeProperties, 
			themes,
			nodes, 
			getNode,
			createNode,
			addNode,
			updateNode,
			addNodeProperty,
			setNodeProperties,
			updateNodeProperty,
			removeNodeProperty,
			toggleNodeIncluded,
			setNodeEntityType,
			setNodeLabel,
			removeNode,
			edgeSchema,
			edges,
			getEdge,
			createEdge,
			addEdge,
			updateEdge,
			addEdgeProperty,
			updateEdgeProperty,
			removeEdgeProperty,
			setEdgeType,
			removeEdge,
			reverseEdge,
			loadFromQuery,
			prepareQuery,
			clearGraph,
		}}>
			{ children }
		</GraphContext.Provider>
	)
}