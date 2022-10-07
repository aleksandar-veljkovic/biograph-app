import Utilities from "../../utilities/utilities";

class BioGraphNode {
	constructor(type, path, data) {
		this.data = data;
		this.type = type;
		this.path = path;

		this.generateKey();
	}

	generateKey() {
		this._key = Utilities.sha3(`${this.type}/${this.path.join('/')}`);
	}

	store(db, tx) {
		// return db.createNode(tx, this.labels, { ...this.data, _key: this._key, type: this.type });
	}	

	getKey() {
		return this._key;
	}
}

export default BioGraphNode;