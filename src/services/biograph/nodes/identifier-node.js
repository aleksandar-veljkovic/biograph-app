import BioGraphNode from "./biograph-node";

class IdentifierNode extends BioGraphNode {
	constructor(identifierType, identifierTitle, identifierValue) {
		const path = [identifierType, identifierTitle, identifierValue];
		super('Identifier', path);

		this.identifierType = identifierType;
		this.identifierValue = identifierValue;
		this.identifierTitle = identifierTitle;
	}

	getSerialized() {
		return {
			model: 'Identifier',
			values: {
				id: this._key,
				identifier_type: this.identifierType,
				identifier_value: this.identifierValue,
				identifier_title: this.identifierTitle,
				vertex_id: this._key
			}
		}
	}
}

export default IdentifierNode;