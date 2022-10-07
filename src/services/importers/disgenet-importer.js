import axios from "axios";
import fs from "fs";
import gunzip from "gunzip-file";
import { TSV } from 'tsv';


class DisgenetImporter {
	constructor(biograph, url) {
		this.biograph = biograph;
		this.url = url;
	}

	async downloadFile() {
		console.log('Downloading file...');
		const res = await axios({
				url: this.url,
				method: 'GET',
				responseType: 'blob',
				withCredentials: false,
				crossdomain: true,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
		});
		console.log('File downloaded, writting to file');

		let blob = new Blob([res.data], {type: 'application/zip'});
		const stream =  blob.stream();

		const writer = fs.createWriteStream('/tmp/disgenet.tsv.gz');
		const ws = new WritableStream(writer);

		stream.pipeTo(ws);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
			
		});
	}

	unzip() {
		return new Promise((resolve, reject) => {
			gunzip('/tmp/disgenet.tsv.gz', '/tmp/disgenet.tsv', () => {
				resolve();
			})
		});
	}

	async import() {
		let importId = this.biograph.startNewImport();

		// DPI: "0.538"
		// DSI: "0.7"
		// EI: 1
		// NofPmids: 1
		// NofSnps: 0
		// YearFinal: 2008
		// YearInitial: 2008
		// diseaseClass: "C04"
		// diseaseId: "C0001418"
		// diseaseName: "Adenocarcinoma"
		// diseaseSemanticType: "Neoplastic Process"
		// diseaseType: "group"
		// geneId: 1
		// geneSymbol: "A1BG"
		// score: "0.01"
		// source: "LHGDN"

		// await this.downloadFile();
		// console.log('File written');

		// await this.unzip();

		const tsvFile = fs.readFileSync('/tmp/disgenet.tsv','utf8');

		const parser = new TSV.Parser("\t", { header: true });

		const parsedData = parser.parse(tsvFile);
		
		for (let i = 0; i < parsedData.length; i += 1) {
			const disease = parsedData[i];

			if (i % 20000 == 0 && i !== 0) {
				console.log(`DisGeNet: ${i}`);
				await this.biograph.executeImport(importId);
				importId = this.biograph.startNewImport();
			}

			const { 
				diseaseId, 
				diseaseName, 
				diseaseType, 
				diseaseClass,
				diseaseSemanticType,
			} = disease;

			// Create disase
			const diseaseEntityId = this.biograph.createEntity('Disease', diseaseId, importId);

			this.biograph.createIdentifier('id', 'condition_id', diseaseId, diseaseEntityId, importId);
			this.biograph.createIdentifier('name', 'disease_type', diseaseType, diseaseEntityId, importId);
			this.biograph.createIdentifier('name', 'disease_semantic_type', diseaseSemanticType, diseaseEntityId, importId);

			this.biograph.createData('disgenet', {
				disease_name: diseaseName,
			}, diseaseEntityId, importId);

			for (const dclass of diseaseClass.split(';')) {
				this.biograph.createIdentifier('name', 'disease_class', dclass, diseaseEntityId, importId);
			}

			// TODO: Disease class names

			const { geneId, geneSymbol, DSI, DPI, score } = disease;

			const geneEntityId = this.biograph.createEntity('Gene', geneSymbol.trim(), importId);
			this.biograph.createIdentifier('id', 'gene_id', geneId, geneEntityId, importId);
			this.biograph.createIdentifier('name', 'gene_name', geneSymbol.trim(), geneEntityId, importId);

			const edgeData = {
				dsi: DSI || null,
				dpi: DPI || null,
				score: score ? parseFloat(score) : null
			}

			this.biograph.createCustomEdge(diseaseEntityId, geneEntityId, 'RELATED_GENE', edgeData, importId);
		}

		await this.biograph.executeImport(importId);
		console.log(`DisGeNet: DONE (${parsedData.length})`);
	}
}

export default DisgenetImporter;