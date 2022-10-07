import BioGraphNode from "./biograph-node";
import Utilities from "../../utilities/utilities";

class DataNode extends BioGraphNode {
	constructor(dataObj, parentObjKey, dataSource) {
		'/{source}/{entity_vertex_id}/{dumps(data)}'

		const data = {
			...dataObj,
			dataSource,
		}

		const path = [
			'Data',
			dataSource,
			parentObjKey,
			Utilities.sha3(data),
		];

		super('Data', path, data);

		this.parentObjKey = parentObjKey;
		this.payload = dataObj;
		this.dataSource = dataSource;
	}

	getSerialized() {
		return {
				model: 'Data',
				values: {
					id: this._key,
					entity_id: this.parentObjKey,
					data: this.payload,
					vertex_id: this._key,
					data_source: this.dataSource,
				}
			}
	}
}

export default DataNode;