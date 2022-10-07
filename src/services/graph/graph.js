import utilityService from "../utilities/utilities";

class GraphService {
	constructor() {
		this.vertices = [];
		this.edges = [];
		this.onGraphUpdated = null;
	}

	onUpdate(callback) {
		this.onGraphUpdated = callback;
	}

	getElements() {
		return this.vertices.concat(this.edges);
	}

	notify() {
		if (this.onGraphUpdated != null) {
			this.onGraphUpdated();
		}
	}

	addVertex(x, y, edgeType, data={}, label = null) {
		const id = utilityService.generateId();

		const vertex = { 
			id, 
			position: { x: x - 20, y: y - 20 },
			type: 'graphNode',
			data: {
				label: label || id.substr(0, 5),
				onDelete: () => this.removeVertex(id),
				properties: [],
				...data,
				edgeType,
				entityType: 'unselected',
			}
		};

		this.vertices.push(vertex);
		this.notify();
	}

	addEdge(params, edgeType, data={}) {
		const id = utilityService.generateId();

		const edge = {
			...params, 
			id, 
			animated: true, 
			data: {
				onDelete: () => this.removeEdge(id),
				properties: [],
				...data,
				edgeType,
			},
			type: 'graphEdge',
			style: {
				strokeWidth: '3px', 
			}, 
		};

		edge.sourceVertex = this.getVertex(edge.source);
		edge.targetVertex = this.getVertex(edge.target);

		this.edges.push(edge);
		this.notify();
	}

	getEdge(id) {
		return this.edges.find(e => e.id === id);
	}

	getVertex(id) {
		return this.vertices.find(v => v.id === id);
	}

	removeVertex(id) {
		this.vertices = this.vertices.filter(v => v.id !== id);
		this.edges = this.edges.filter(e => e.source !== id && e.target !== id);

		console.log(this.vertices);

		this.notify();
	}

	removeEdge(id) {
		this.edges = this.edges.filter(e => e.id !== id);
		this.notify();
	}
}

export default new GraphService();