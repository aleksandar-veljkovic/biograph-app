import axios from "axios";

class DisprotImporter {
	constructor(biograph, url) {
		this.biograph = biograph;
		this.url = url;
	}

	async import() {
		// Acc list of all imported proteins from disprot
		const proteinAcc = [];

		const { data, size } = (await axios.get(this.url)).data;

		let i = 0;

		const importId = this.biograph.startNewImport();

		for (const protein of data) {
			i += 1;
			if (i % 100 == 0) {
				console.log(`DisProt: ${i}`);
			}

			const {
				acc,
				disprot_id,
				name,
			} = protein;

			proteinAcc.push(acc);

			let uniref50 = null;
			if (protein.uniref50 != null) {
				uniref50 = protein.uniref50;
			}

			let uniref90 = null;
			if (protein.uniref90 != null) {
				uniref90 = protein.uniref90;
			}

			let uniref100 = null;
			if (protein.uniref100 != null) {
				uniref100 = protein.uniref100;
			}

			const proteinEntityId = this.biograph.createEntity('Protein', acc, importId);
			this.biograph.createIdentifier('id', 'uniprot_acc', acc, proteinEntityId, importId);
			this.biograph.createIdentifier('id', 'disprot_id', disprot_id, proteinEntityId, importId);

			if (uniref50 != null) {
				this.biograph.createIdentifier('id', 'uniref50', uniref50, proteinEntityId, importId);
			}

			if (uniref90 != null) {
				this.biograph.createIdentifier('id', 'uniref90', uniref90, proteinEntityId, importId);
			}

			if (uniref100 != null) {
				this.biograph.createIdentifier('id', 'uniref100', uniref100, proteinEntityId, importId);
			}

			this.biograph.createIdentifier('id', 'disprot_uri', `https://disprot.org/${disprot_id}`, proteinEntityId, importId);
			this.biograph.createIdentifier('name', 'protein_name', name, proteinEntityId, importId);

			// Taxonomy
			// ==========================

			const taxonId = protein.ncbi_taxon_id;

			const organismName = protein.organism;

			const organismEntityId = this.biograph.createEntity('Organism', taxonId, importId);
			const taxonEntityId = this.biograph.createEntity('Taxon', taxonId, importId);

			this.biograph.createIdentifier('id', 'taxon_id', taxonId, organismEntityId, importId);
			this.biograph.createIdentifier('id', 'taxon_name', organismName, organismEntityId, importId);

			this.biograph.createIdentifier('id', 'taxon_id', taxonId, taxonEntityId, importId);
			this.biograph.createIdentifier('id', 'taxon_name', organismName, taxonEntityId, importId);

			this.biograph.createData('disprot', { species: taxonId }, organismEntityId, importId)

			this.biograph.createCustomEdge(proteinEntityId, organismEntityId, 'FROM_ORGANISM', {}, importId);


			// Protein data
			// ==========================

			const proteinLength = protein.length;
			const disorderContent = protein.disorder_content;
			const regionsCounter = protein.regions_counter;

			this.biograph.createData('disprot', {
				length: proteinLength,
				disorder_content: disorderContent,
				regions_counter: regionsCounter,
			}, proteinEntityId, importId);

			// Protein features
			// ==========================

			const features = protein.features;

			for (const key in features) {
				const featuresList = features[key];

				for (const feature of featuresList) {
					const featureId = feature.id;
					const featureStart = feature.start;
					const featureEnd = feature.end;

					let featureName = null;

					if (feature.name != null) {
						featureName = feature.name;
					}

					const featureEntityId = this.biograph.createEntity('ProteinFeature', featureId, importId);
					this.biograph.createCustomEdge(proteinEntityId, featureEntityId, 'HAS_FEATURE', {}, importId);

					this.biograph.createIdentifier('id', 'feature_id', featureId, featureEntityId, importId);

					if (name != null) {
						this.biograph.createIdentifier('name', 'feature_name', featureName, featureEntityId, importId);
					}

					const featureData = {
						start: featureStart,
						end: featureEnd,
						feature_type: key,
						length: featureEnd - featureStart,
					}

					this.biograph.createData('disprot', featureData, featureEntityId, importId);
				}
			}
			// Protein regions
			// ==========================

			const { regions } = protein;

			for (const region of regions) {
				const featureId = region.region_id;
				const featureStart = region.start;
				const featureEnd = region.end;
				const featureTermName = region.term_name;

				const featureEntityId = this.biograph.createEntity('ProteinFeature', featureId, importId);
				this.biograph.createCustomEdge(proteinEntityId, featureEntityId, 'HAS_FEATURE', {}, importId);

				this.biograph.createIdentifier('id', 'feature_id', featureId, featureEntityId, importId);
				this.biograph.createIdentifier('name', 'feature_term_name', featureTermName, featureEntityId, importId);

				const featureData = {
					start: featureStart,
					end: featureEnd,
					feature_type: featureTermName.trim(),
					length: featureEnd - featureStart,
				};

				this.biograph.createData('disprot', featureData, featureEntityId, importId)
			}
		}

		
		await this.biograph.executeImport(importId);

		console.log(`Disprot: DONE (${size})`);
		return proteinAcc;
	}
}

export default DisprotImporter;