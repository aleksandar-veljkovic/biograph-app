import BioGraphNode from "./biograph-node";
import Utilities from "../../utilities/utilities";

class EntityNode extends BioGraphNode {
	constructor(entityType, primaryId) {

		const path = [
			'Object',
			entityType,
			primaryId,
		];

		super('Object', path);

		this.entityType = entityType;
		this.primaryId = primaryId;
	}

	getSerialized() {
		return {
			model: 'Object',
			values: {
				id: this._key,
				vertex_id: this._key,
				entity_type: this.entityType,
				primary_id: this.primaryId,
			}
		}
	} 
}

export default EntityNode;