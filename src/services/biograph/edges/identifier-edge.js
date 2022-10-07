import BioGraphEdge from "./biograph-edge";

class IdentifierEdge extends BioGraphEdge {
	constructor(identifierKey, objectKey) {
		const labels = ['HAS_ID'];
		super(labels, objectKey, identifierKey);
	}
}

export default IdentifierEdge;