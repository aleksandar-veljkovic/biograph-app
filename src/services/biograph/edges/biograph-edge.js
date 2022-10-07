import Utilities from "../../utilities/utilities";

class BioGraphEdge {
	constructor(labels, fromKey, toKey, data={}) {
		this.fromKey = fromKey;
		this.toKey = toKey;
		this.labels = labels;
		this.data = data;

		this.generateKey();
	}

	generateKey() {
		this._key = Utilities.sha3(`${this.labels.join(':')}/${this.fromKey}/${this.toKey}`);
	}

	store(db, tx) {
		return db.createEdge(tx, this.fromKey, this.toKey, this.labels, {...this.data, _key: this._key, label: this.labels[0] });
	}

	getSerialized() {
		return {
			model: 'edge',
			values: {
				id: this._key,
				edge_type: this.labels[0],
				from_vertex: this.fromKey,
				to_vertex: this.toKey,
				data: this.data,
			}
		}
	}
}

export default BioGraphEdge;