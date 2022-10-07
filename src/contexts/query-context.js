import React, { createContext, useRef, useState } from "react";
import axios from "axios";
import Utilities from "../services/utilities/utilities";
import exampleQueries from "./example-queries";

const { parse } = require('json2csv');

export const QueryContext = createContext();

const  QueryContextProvider = ({ children }) => {
	const [results, setResults] = useState(null);
	const host = 'http://127.0.0.1';
	const port = 8765;
	const [isBusy, setIsBusy] = useState(false);
	const [isTableBusy, setIsTableBusy] = useState(false);
	const [singleNode, setSingleNode] = useState(null);

	const currentQuery = useRef(null);
	const rawQuery = useRef(null);

    console.log(results);

	const runQuery = (graphQuery) => {
		console.log(graphQuery);
		currentQuery.current = graphQuery;
		return new Promise((resolve, reject) => {
			setIsBusy(true);
			axios.post(`${host}:${port}/query`, 
				{
					query: graphQuery,
				}
			).then(res => { setResults(res.data); resolve(res.data) })
			.catch (err => { console.log(err); reject(err) })
			.finally(() => {
				setIsBusy(false);
			});
		})
	}

	const clearSelectedNode = () => {
		setSingleNode(null);
	}

	const getNode = (primaryId) => {
		return new Promise((resolve, reject) => {
			setSingleNode(null);
			setIsTableBusy(true);
			axios.get(`${host}:${port}/node`, 
			{
				params: {
					primaryId,
					// entityType: Utilities.capitalize(entityType),
				}
			}
		).then(res => { setIsTableBusy(false); setSingleNode(res.data); resolve(res.data) })
			.catch (err => { setIsTableBusy(false); console.log(err); reject(err) })
		})
	}

	const getEntityType = (nodeId) => {
		if (!results || results.length == 0) {
			return nodeId;
		}

		const types = Object.keys(results[0]).reduce((prev, curr) => {
			const [entityType, id, primaryId] = curr.split('__');
			prev[id] = entityType;
			return prev;
		}, {});

		return types[nodeId];
	}

	const resultsToCsv = () => {
		// const fields = currentQuery.current.returns.map(el => ({ label: currentQuery.current.labels[el] || `${getEntityType(el)}:Unlabeled`, value: el }));
		// const values = results.map(result => Object.keys(result).reduce((prev, curr) => {
		// 	const [entityType, id, valueType] = curr.split('__');
		// 	if (valueType === 'primary_id') {
		// 		prev[id] = result[curr];
		// 	}

		// 	return prev;
		// }, {}))

		// const csv = parse(values, { fields });
		// return csv;

        const values = [];
        for (let i = 0; i < results.length; i += 1) {
            for (let j = 0; j < results[i].length; j += 1) {
                let branchID = 0;
                for (let k = 0; k < results[i][j].length; k += 2) {
                    if (k == results[i][j].length - 1 && results[i][j].length > 1) {
                        continue;
                    }

                    const output = {
                        patternID: i,
                        pathID: j,
                        branchID,
                        sourceEntityType: results[i][j][k].entityType,
                        sourceEntityId: results[i][j][k].primaryId,
                        relation: results[i][j][k + 1] ? results[i][j][k + 1].relationship.type : null,
                        relationData: results[i][j][k + 1] ? {...results[i][j][k + 1].relationship.properties, id: undefined } : null,
                        destinationEntityType: results[i][j][k + 2] ? results[i][j][k + 2].entityType : null,
                        destinationEntityId: results[i][j][k + 1] ? results[i][j][k + 2].primaryId : null,
                    };

                    values.push(output);

                    branchID += 1;
                }
            }
        }

        const csv = parse(values, { fields: [ 'patternID', 'pathID', 'branchID', 'sourceEntityId', 'sourceEntityType', 'relation', 'destinationEntityType']});
        return csv;
	}

	const clearResults = () => {
		setResults(null);
		currentQuery.current = null;
	}

	return (
		<QueryContext.Provider value={{ clearResults, results, isBusy, isTableBusy, runQuery, getNode, singleNode, clearSelectedNode, currentQuery, resultsToCsv, rawQuery, exampleQueries: exampleQueries }}>
			{ children }
		</QueryContext.Provider>
	)
}

export default QueryContextProvider