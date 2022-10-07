import React, { useContext, useState } from "react";
import { QueryContext } from "../../contexts/query-context";
import PerfectScrollbar from 'react-perfect-scrollbar'
import { DataTable } from "../data-table/data-table";
import Utilities from "../../services/utilities/utilities";
import { ChevronLeftRounded, Close } from "@mui/icons-material";
import { DataPanel } from "../data-panel/data-panel";

export const SingleNodeViewer = ({ nodeData }) => {
	const { clearSelectedNode, getNode } = useContext(QueryContext);

	const onClose = () => {
		clearSelectedNode();
	}

	console.log(nodeData);

	const neighborGroups = nodeData.neighbors.reduce((prev, curr) => {
		if (prev[curr.entityType] == null) {
			prev[curr.entityType] = {
				name: curr.entityType,
				connections: [],
			};
		}

		prev[curr.entityType].connections.push(curr);
		return prev;
	}, {})

	const groupedIdentifiersObj = (nodeData.identifiers || []).reduce((prev, curr) => {
		console.log(curr);
		if (prev[curr.title] == null) {
			prev[curr.title] = { type: curr.type, values: []};
		}

		prev[curr.title].values.push(curr.value)
		return prev;
	}, {});

	const groupedIdentifiers = Object.keys(groupedIdentifiersObj).map(title => ({ title, type: groupedIdentifiersObj[title].type, value: groupedIdentifiersObj[title].values.join(', ') }));
	console.log(groupedIdentifiers);

	return (
		<div onScroll={(e) => e.stopPropagation()} className="single-node-viewer">
			<div className="content-panel" onClick={(e) => e.stopPropagation()}>
				<div className="node-header">
					<h2>{nodeData.entityType} {nodeData.id}</h2>
					<span className="close-panel" onClick={() => onClose()}><Close/></span>
				</div>
				<div className="content-wrap">
					<div className="node-content">
						{/* <PerfectScrollbar options={{wheelPropagation: false}}> */}
							<div className="section-content-wrap">
								<h3>Object details</h3>
								<p>Primary ID: {nodeData.id}</p>
								<p>Entity type: {nodeData.entityType}</p>
								<DataPanel title="Identifiers" isToggled={true}>
									{
										nodeData.identifiers.length > 0 ? (
											<DataTable
												rows={
													groupedIdentifiers.map(identifier => 
														({ 
															identifier_title: identifier.title,
															identifier_value:  identifier.type.includes('uri') ? <a href={identifier.value} target="_blank">{identifier.value}</a> : identifier.value,
														}))}
												columns={[{name: 'Identifier', key: 'identifier_title'}, {name: 'Value', key: 'identifier_value'}]}
											/>
										) : <p>No identifiers found</p>
									}
								</DataPanel>

								<DataPanel title="Data entries" isToggled={true}>
									{
										nodeData.data.length > 0 ? (
											<DataTable 
												rows={nodeData.data.map(d => 
													Object.keys(d).filter(el => el != 'id' && el != 'source')
														.map(key => 
															({ key, value: d[key], source: d.source })
														)).reduce((prev, curr) => prev.concat(curr), []).map(dataObj => 
													({ 
														data_property: Utilities.beautifyCamelCase(dataObj.key),
														data_value: dataObj.value,
														source: dataObj.source,
													}))}
															columns={[{name: 'Property', key: 'data_property'}, {name: 'Value', key: 'data_value'}, {name: 'Source', key: 'source'}]}
													/>
										) : <p>No data entries found</p>
									}
								</DataPanel>
							
								{/* <p>{JSON.stringify(nodeData, null, 2)}</p> */}
								<h3>Relations</h3>
								{ Object.keys(neighborGroups).length > 0 ? (
									Object.keys(neighborGroups).map(groupKey => (
										<DataPanel title={`With ${ neighborGroups[groupKey].name }s (${neighborGroups[groupKey].connections.length})`}>
											{
													<DataTable 
														columns={[
															{ key: 'id', name: `${neighborGroups[groupKey].name} ID` },
															{ key: 'edgeType', name: 'Relation type' }, 
															// { key: 'edgeData', name: 'Connection data' },
															...Object.keys(neighborGroups[groupKey].connections[0].edgeData).map(dataKey =>
																(
																	{ key: dataKey, name: Utilities.beautifyCamelCase(dataKey) }
																)
															)
														]}
														rows={neighborGroups[groupKey].connections.map(el => ({ 
															...el, 
															edgeType: Utilities.beautifyCamelCase(el.edgeType),
															id: <span className="node-link" onClick={() => getNode(el.id)}>{el.id}</span>,
															...el.edgeData,
														}))}
													/>
											}
										</DataPanel>
									))
								): <p>No connections found</p>}
							</div>
						{/* </PerfectScrollbar> */}
					</div>
				</div>
			</div>
		</div>
	)
}