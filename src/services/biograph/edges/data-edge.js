import BioGraphEdge from "./biograph-edge";

class DataEdge extends BioGraphEdge {
	constructor(dataKey, objectKey) {
		const labels = ['HAS_DATA'];
		super(labels, objectKey, dataKey);
	}
}

export default DataEdge;