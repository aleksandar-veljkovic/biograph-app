import React, { useContext, useState, useRef } from "react";
import { ReactFlowProvider } from "react-flow-renderer";
import { GraphDisplay } from '../../components/graph-display/graph-display';
import { QueryContext } from "../../contexts/query-context";
import { ResultsTable } from "../../components/results-table/results-table";
import { Loader } from "../../components/loader/loader";


export const HomePage = () => {
	const { runQuery, isBusy, results, isTableBusy } = useContext(QueryContext);
	const [labels, setLabels] = useState(null);
 	const resultsRef = useRef(null);

	const onQuery = (query) => {
		// setLabels(labels);
		runQuery(query).then(() => {
			console.log(results);
				setTimeout(() => window.scrollTo(0, document.getElementById('results-start').offsetTop, 100))
			}
		).catch(err => {
			alert('Invalid query!');
		});
	}
	
	return (
		<div className="home-page">
			{ isBusy && <Loader action="Running query"/> }

			<ReactFlowProvider>
				<GraphDisplay onQuery={(query) => onQuery(query)}/>
			</ReactFlowProvider>
			<span id="results-start"/>
			{ !isBusy && results && <ResultsTable isBusy={isTableBusy} labels={labels}/> }
		</div>
	)
}