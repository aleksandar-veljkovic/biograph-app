import axios from "axios";

class UniprotImporter {
	constructor(biograph, url) {
		this.biograph = biograph;
		this.url = url;
	}

	async import(accIds) {
		const importId = this.biograph.startNewImport();
		for (let i = 0; i < accIds.length; i += 100) {
			console.log(`UniProt: ${i}`);

			const accSubset = accIds.slice(i, i + 100);

			const res = await axios.get(this.url, {
				params: {
					offset: 0,
					size: 100,
					format: 'json',
					accession: accSubset.join(',')
				}
			})

			const batch = res.data;
			
			for (const protein of batch) {
				// Identifiers
				// ========================

				const proteinId= protein.accession;
				const uniprotId = protein.id;

				const proteinEntityId = this.biograph.createEntity('Protein',  proteinId, importId);
				this.biograph.createIdentifier('id', 'uniprot_acc', proteinId, proteinEntityId, importId);

				if (uniprotId != null) {
					this.biograph.createIdentifier('id', 'uniprot_id', uniprotId, proteinEntityId, importId);
				}

				this.biograph.createIdentifier('uri', 'uniprot_uri', `https://uniprot.org/uniprot/${proteinId}`, proteinEntityId, importId);

				// Protein metadata
				// ========================

				const proteinMeta = protein.protein;

				const { recommendedName: recommendedNameObj } = proteinMeta
				
				if (recommendedNameObj != null) {
					const recommendedName = recommendedNameObj.fullName.value;
					this.biograph.createIdentifier('name', 'recommended_name', recommendedName.trim(), proteinEntityId, importId);
				}

				const { alternativeName: alternativeNames } = proteinMeta;
				
				if (alternativeNames != null) {
					for (const alternativeNameObj of alternativeNames) {
						const alternativeName = alternativeNameObj.fullName.value;

						this.biograph.createIdentifier('name', 'alternative_name', alternativeName.trim(), proteinEntityId, importId);
					}
				}

				const { gene: genes } = protein;

				if (genes != null) {
					for (const gene of genes) {
						const geneName = gene.name ? gene.name.value : null;
						let geneEntityId = null;

						if (geneName != null) {
							geneEntityId = this.biograph.createEntity('Gene', geneName.trim(), importId);
							this.biograph.createCustomEdge(proteinEntityId, geneEntityId, 'FROM_GENE', {}, importId);
							this.biograph.createIdentifier('name', 'gene_name', geneName.trim(), geneEntityId, importId);
						}

						else if (gene.orfNames != null) {
							const { orfNames } = gene;

							let firstIdentifier = true;

							for (const orfNameObj of orfNames) {
								const orfName = orfNameObj.value;

								if (firstIdentifier) {
									geneEntityId = this.biograph.createEntity('Gene', orfName.trim(), importId);
									firstIdentifier = false;
								}

								if (geneEntityId) {
									this.biograph.createIdentifier('name', 'orf_name', orfName.trim(), geneEntityId, importId);
								}
							}
						}

						if (gene.synonyms != null) {
							for (const synonymNameObj of gene.synonyms) {
								const synonymName = synonymNameObj.value;
								this.biograph.createIdentifier('name', 'synonym_name', synonymName.trim(), geneEntityId, importId);
							}
						}
					}
				}
			}
		}

		await this.biograph.executeImport(importId);
		console.log(`UniProt: DONE (${accIds.length})`);
	}
}

export default UniprotImporter;