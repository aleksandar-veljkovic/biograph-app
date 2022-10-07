import fs from 'fs';
import { TSV } from 'tsv';
import axios from "axios";

class ElmImporter {
	constructor(biograph, classesUrl, instancesUrl) {
		this.biograph = biograph;
		this.classesUrl = classesUrl;
		this.instancesUrl = instancesUrl;
	}
	
	async downloadClasesFile() {
		console.log('Downloading file...');
		const res = await axios({
				url: this.classesUrl,
				method: 'GET',
				responseType: 'blob',
				withCredentials: false,
				crossdomain: true,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
		});
		console.log('File downloaded, writting to file');

		let blob = new Blob([res.data], {type: 'text/csv'});
		const stream =  blob.stream();

		const writer = fs.createWriteStream('/tmp/elm-classes.tsv');
		const ws = new WritableStream(writer);

		stream.pipeTo(ws);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
			
		});
	}

	async downloadInstancesFile() {
		console.log('Downloading file...');
		const res = await axios({
				url: this.instancesUrl,
				method: 'GET',
				responseType: 'blob',
				withCredentials: false,
				crossdomain: true,
				timeout: 100000,
				headers: {
					"Access-Control-Allow-Origin": "*",
				},
		});
		console.log('File downloaded, writting to file');

		let blob = new Blob([res.data], {type: 'text/csv'});
		const stream =  blob.stream();

		const writer = fs.createWriteStream('/tmp/elm-instances.tsv');
		const ws = new WritableStream(writer);

		stream.pipeTo(ws);

		return new Promise((resolve, reject) => {
			writer.on('finish', resolve);
			writer.on('error', reject);
			
		});
	}

	async import() {
		const importId = this.biograph.startNewImport();

		// await this.downloadClasesFile();
		// await this.downloadInstancesFile();

		const proteins = new Set([]);

		const classesTsvFile = fs.readFileSync('/tmp/elm-classes.tsv','utf8');
		const instancesTsvFile = fs.readFileSync('/tmp/elm-instances.tsv','utf8');

		const parser = new TSV.Parser("\t", { header: true });

		const elmClasses = parser.parse(classesTsvFile);
		const elmInstances = parser.parse(instancesTsvFile);
		
		// ELM Classes
		// =================

		for (const classRow of elmClasses) {
			const { 
				accession: classAccessionId,
				ELMIdentifier: classIdentifier,
				FunctionalSiteName: classFuncSiteName,
				Description: classDesc,
				Reges: classRegex,
				Probability: classProb,
			} = classRow;

			// ELM class entity
			const elmClassEntityId = this.biograph.createEntity('ELMClass', classIdentifier, importId);

			// ELM class identifiers
			this.biograph.createIdentifier('id', 'elm_identifier', classIdentifier, elmClassEntityId, importId);
			this.biograph.createIdentifier('id', 'accession_id', classAccessionId, elmClassEntityId, importId);

			// ELM class data
			this.biograph.createData('elm', {
				functional_site_name: classFuncSiteName,
				description: classDesc,
				regex: classRegex,
				probability: classProb,
			}, elmClassEntityId, importId);
		}

		// ELM insances
		// ==================

		for (const instanceRow of elmInstances) {
			const { 
				Accession: instanceAccessionId,
				Accessions: allInstanceAccessionIds,
				ELMType: instanceType,
				ELMIdentifier: instanceIdentifier,
				ProteinName: proteinName,
				Primary_Acc: primaryUniprotAcc,
				References: instanceReferences,
				Methods: instanceMethods,
				InstanceLogic: instanceLogin,
				PDB: instancePdbAcc,
				Organism: instanceOrganism,
				Start: instanceStart,
				End: instanceEnd,
			} = instanceRow;

			let allUniprotAcc = [];
			if (allInstanceAccessionIds != null) {
				allUniprotAcc = `${allInstanceAccessionIds}`.split(' ');
			}

			let elmInstanceReferences = [];

			if (instanceReferences != null) {
				elmInstanceReferences = `${instanceReferences}`.split(' ');
			}

			// ELM instance entity
			const elmInstanceEntityId = this.biograph.createEntity('ELM', instanceAccessionId, importId);

			// ELM instance identifiers
			this.biograph.createIdentifier('id', 'elm_identifier', instanceIdentifier, elmInstanceEntityId, importId);
			this.biograph.createIdentifier('id', 'accession_id', instanceAccessionId, elmInstanceEntityId, importId);

			// connect ELM instance to ELM class
			const classEntityId = this.biograph.createEntity('ELMClass', instanceIdentifier, importId);
			this.biograph.createCustomEdge(elmInstanceEntityId, classEntityId, 'FROM_ELM_CLASS', {}, importId);

			if (instancePdbAcc != null) {
				this.biograph.createIdentifier('id',' pdb_id', instancePdbAcc, elmInstanceEntityId, importId);
			}

			for (const uniprotId of allUniprotAcc) {
				this.biograph.createIdentifier('id', 'uniprot_id', uniprotId, elmInstanceEntityId, importId);
			}

			// ELM instance data
			this.biograph.createData('elm', {
				elm_type: instanceType,
				start: instanceStart,
				end: instanceEnd,
				references: instanceReferences,
				methods: instanceMethods,
				instance_logic: instanceLogin,
				organism: instanceOrganism,
			}, elmInstanceEntityId, importId);

			if (primaryUniprotAcc != null && primaryUniprotAcc.length > 0) {
				// Protein
				const proteinEntityId = this.biograph.createEntity('Protein', primaryUniprotAcc, importId);
				this.biograph.createIdentifier('id', 'uniprot_id', primaryUniprotAcc, proteinEntityId, importId)
				this.biograph.createIdentifier('name', 'protein_name', proteinName, proteinEntityId, importId);

				// Connect ELM to protein
				this.biograph.createCustomEdge(elmInstanceEntityId, proteinEntityId, 'IN_PROTEIN', {}, importId);

				proteins.add(primaryUniprotAcc);
			}
		}

		await this.biograph.executeImport(importId);
		console.log(`ELM: DONE (${elmClasses.length} classes, ${elmInstances.length} instances)`);
		
		return Array.from(proteins);
	}
}

export default ElmImporter