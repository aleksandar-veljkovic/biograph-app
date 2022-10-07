import EntityNode from '../biograph/nodes/entity-node';
import fs, { readFileSync } from 'fs';

const tabletojson = require('tabletojson').Tabletojson;


class TantigenImporter {
	constructor(biograph, url, numAntigens=4507) {
		this.biograph = biograph;
		this.url = url;
		this.numAntigens = numAntigens;
	}

	downloadTable(antigenId) {
		return new Promise((resolve, reject) => {
			tabletojson.convertUrl(
				`${this.url}?ACC=${antigenId}`,
				(tablesAsJson) => {
						if (tablesAsJson[1]) {
							fs.writeFileSync(`/Users/aleksandar/tantigen/${antigenId}.json`, JSON.stringify(tablesAsJson[1], null, 2), { flag : 'w'});
						}
						resolve(tablesAsJson[1]);
				})
			})
	}

	readFiles() {
		return fs.readdirSync('D:\\BioGraph\\tantigen');
	}

	openTantigenFile(filename) {
		return JSON.parse(readFileSync(`D:\\BioGraph\\tantigen\\${filename}`, { encoding: 'utf8'}));
	}

	async import() {
		// const res = await scraper.get();
		const proteins = new Set([]);

		const objects = new Set([]);
		const dataRefObjects = new Set([]);

		let successfulImports = 0;
		
		const files = this.readFiles();

		let geneEntityId = null;
		let epitopes = null;
		let hlaLigands = null;

		let importId = null;
		importId = this.biograph.startNewImport();
		
		// for (let i = 3230; i <= this.numAntigens; i += 1) {
		for (const filename of files) {
			// const num = `${i}`;
			// const antigenId = `Ag${num.padStart(6, '0')}`;
			const antigenId = filename.split('.')[0];
			const table = this.openTantigenFile(filename);

			// const table = await this.downloadTable(antigenId);
			// if (table == null) {
			// 	continue;
			// }

			successfulImports += 1;
			
			// if (i % 100 == 0 && i !== 0) {
			// console.log(`TANTIGEN: ${i}`);
			if (successfulImports > 0 && successfulImports % 100 == 0) {
				console.log(`TANTIGEN: ${successfulImports}`);
				await this.biograph.executeImport(importId);
				importId = this.biograph.startNewImport();
			}
			// }

			const antigenEntityId = this.biograph.createEntity('Antigen', antigenId, importId);
			this.biograph.createIdentifier('id', 'antigen_acc', antigenId, antigenEntityId, importId);

			objects.add(antigenEntityId);

			geneEntityId = null;
			epitopes = null;
			hlaLigands = null;

			const antigenData = {};

			for (const row of table) {
				const key = row[0];

				if (key == 'Antigen Name') {
					const antigenName = row[1];
					geneEntityId = this.biograph.createEntity('Gene', antigenName.trim(), importId);

					this.biograph.createIdentifier('name', 'antigen_name', antigenName, antigenEntityId, importId);
					this.biograph.createIdentifier('id', 'gene_name', antigenName, geneEntityId, importId);
					this.biograph.createCustomEdge(geneEntityId, antigenEntityId, 'IS_ANTIGEN', {}, importId);
				}

				if (key == 'Common Name') {
					const commonName = row[1];
					this.biograph.createIdentifier('name', 'antigen_common_name', commonName, antigenEntityId, importId);
				}

				if (key == 'Full name') {
					antigenData.fullName = row[1];
				}

				if (key == 'Comment') {
					antigenData.comment = row[1];
				}

				if (key == 'Synonym') {
					const synonyms = row[1].split('\n')[0].split('another')[0].split(';').map(el => el.trim());

					for (const synonym of synonyms) {
						this.biograph.createIdentifier('name', 'antigen_synonym_name', synonym, antigenEntityId, importId);
					}
				}

				if (key == 'UniProt ID') {
					const uniprotId = row[1];
					proteins.add(uniprotId);
					const proteinEntityId = this.biograph.createEntity('Protein', uniprotId, importId);
					objects.add(proteinEntityId);

					this.biograph.createIdentifier('id', 'uniprot_id', uniprotId, proteinEntityId, importId);
					this.biograph.createIdentifier('id', 'uniprot_id', uniprotId, antigenEntityId, importId);
					this.biograph.createCustomEdge(proteinEntityId, antigenEntityId, 'IS_ANTIGEN', {}, importId);
				}

				if (key == 'NCBI Gene ID') {
					const geneId = row[1];
					if (geneEntityId != null) {
						this.biograph.createIdentifier('id', 'ncbi_id', geneId, geneEntityId, importId);
					}
				}

				if (key == 'Annotation') {
					const annotation = row[1];
					antigenData.annotation = annotation;
				}

				if (key == 'Isoforms') {
					const isoforms = row[1].split('Alignment')[0].split('\n')[0].split(',').map(el => el.trim());
					for (const isoform of isoforms) {
						const isoNodeId = this.biograph.createEntity('Antigen', isoform, importId);

						this.biograph.createCustomEdge(antigenEntityId, isoNodeId, 'IS_ISOFORM', {}, importId);
						this.biograph.createCustomEdge(isoNodeId, antigenEntityId, 'IS_ISOFORM', {}, importId);
					}
				}

				if (key == 'Mutation entries') {
					const mutationEntries = row[1].split('View')[0].split(',').map(el => el.trim());

					for (const entry of mutationEntries) {
						const mutationNodeId = this.biograph.createEntity('Antigen', entry, importId);
						objects.add(mutationNodeId);

						this.biograph.createCustomEdge(antigenEntityId, mutationNodeId, 'IS_MUTATION_ENTRY', {}, importId);
						this.biograph.createCustomEdge(mutationNodeId, antigenEntityId, 'IS_MUTATION_ENTRY', {}, importId);
					}
				}

				if (key == 'RNA/protein expression profile') {
					antigenData.rnaProteinExpressionProfile = row[1];
				}
			
				if (key == 'T cell epitope') {
					// First row / header
					if (epitopes == null) {
						epitopes = true;
					} else {
						const [from, to] = row[2].split('-');
						const epitope = {
							sequence: row[1].trim(),
							positionFrom: from,
							positionTo: to,
							hlaAllele: row[3],
							epitopeType: 'T-cell',
						};

						const epitopeReferences = `${row[4]}`.split('\n').map(el => el.trim());

						const epitopeEntityId = (new EntityNode('Epitope', epitope.sequence))._key;

						if (!objects.has(epitopeEntityId)) {
							objects.add(epitopeEntityId);
							this.biograph.createEntity('Epitope', epitope.sequence, importId);
						}

						this.biograph.createIdentifier('sequence', 'epitope_sequence', epitope.sequence, epitopeEntityId, importId);
						this.biograph.createIdentifier('id', 'hla_allele', epitope.hlaAllele, epitopeEntityId, importId);

						for (const reference of epitopeReferences) {
							this.biograph.createIdentifier('id', 'reference_id', reference, epitopeEntityId, importId);
						}

						// if (epitopeEntityId == null) {
						// console.log(epitopeEntityId);
						// }
						this.biograph.createData('tantigen', epitope, epitopeEntityId, importId);
						this.biograph.createCustomEdge(antigenEntityId, epitopeEntityId, 'HAS_EPITOPE', {}, importId);
					}
				}

				if (key == 'HLA ligand') {
					// if (hlaLigands == null) {
					// 	hlaLigands = true;
					if (row[1] != 'Ligand Sequence') {
						const [from, to] = row[2].split('-');

						const hlaLigand = {
							sequence: row[1].trim(),
							positionFrom: from,
							positionTo: to,
							hlaAllele: row[3],
							type: 'HLA ligand'
						}

						const ligandReferences = `${row[4]}`.split('\n').map(el => el.trim());

						const ligandEntityId = (new EntityNode('HLALigand', hlaLigand.sequence))._key;

						if (!objects.has(ligandEntityId)) {
							objects.add(ligandEntityId);
							this.biograph.createEntity('HLALigand', hlaLigand.sequence, importId);
						}

						this.biograph.createIdentifier('sequence', 'ligand_sequence', hlaLigand.sequence, ligandEntityId, importId);
						this.biograph.createIdentifier('id', 'hla_allele', hlaLigand.hlaAllele, ligandEntityId, importId);
						
						for (const reference of ligandReferences) {
							this.biograph.createIdentifier('id', 'reference_id', reference, ligandEntityId, importId);
						}

						this.biograph.createData('tantigen', hlaLigand, ligandEntityId, importId);
						dataRefObjects.add(ligandEntityId);
						this.biograph.createCustomEdge(antigenEntityId, ligandEntityId, 'HAS_LIGAND', {}, importId);
					}
				}
			}
 
			// console.log(this.biograph.imports[importId].objects);
			// console.log(this.biograph.imports[importId].objects.find(obj => obj.values.id == 'ccbbfe5753887acc4ca382b93853f90c34731383d7d61d990c5d92c14596dbd9'));
			this.biograph.createData('tantigen', antigenData, antigenEntityId, importId);
		}

		// return [];

		await this.biograph.executeImport(importId);

		console.log(`TANTIGEN: DONE (${successfulImports})`);
		return Array.from(proteins);
	}
}

export default TantigenImporter;