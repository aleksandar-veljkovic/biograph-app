import { ArrowUpwardRounded, KeyTwoTone, SearchOutlined } from "@mui/icons-material";
import { Button, IconButton, InputBase, Paper, TextField } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useContext, useState } from "react";
import { QueryContext } from "../../contexts/query-context";
import Utilities from "../../services/utilities/utilities";
import { Loader } from "../loader/loader";
import { SingleNodeViewer } from "../single-node-viewer/single-node-viewer";

export const ResultsTable = ({ isBusy }) => {
	const { results, singleNode, getNode, currentQuery, resultsToCsv } = useContext(QueryContext);
	const [resultRows, setResultRows] = useState(results);
	const [pageNum, setPageNum] = useState(0);
	const perPage = 5;
	const isLastPage = (pageNum + 1) * perPage >= results.length;
	const isBeforeLastPage = (pageNum + 2) * perPage >= results.length;

	const filterResults = (query) => {
		const lowerQuery = query.toLowerCase();
		console.log(lowerQuery);
		if (query != null && query.trim().length > 0) {
			setResultRows(
				results.filter(row => 
					row.map(path => 
						path.map(obj => 
							obj.relationship == null && obj.primaryId.toLowerCase().includes(lowerQuery.trim())
						).reduce((prev, curr) => 
							prev || curr, false)
					).reduce((prev, curr) => prev || curr, false)
				)
			)
		} else {
			setResultRows(results);
		}

		setPageNum(0);
	}

	return (
		<div key="results-table" className="results-table">
			{ isBusy && <Loader action="Loading"/> }
			<div key="results-header"className="results-header">
				<h2 key="results-title" className="results-title">Query Results ({ resultRows.length })</h2>

				{/* <div className="results-actions">
					<a href={URL.createObjectURL(new Blob([JSON.stringify(currentQuery, null, 2)], {type : 'application/json'}))} download={'query.json'}>Save Query</a>
					<a href={URL.createObjectURL(new Blob([resultsToCsv()], {type : 'text/csv'}))} download={'results.csv'}>Export to CSV</a>
				</div> */}

				{/* <button className="back-to-query" >Go back to query</button> */}
				<Button onClick={() => window.scrollTo(0,0)} variant="outlined"><ArrowUpwardRounded/> Go Back To Query</Button>

				{/* <input className="filter-results" key="query-input" autoFocus type="text" placeholder="Filter results" onChange={(e) => filterResults(e.target.value)}/> */}
				{/* <TextField className="filter-results" label="Search and filter results..."/> */}

				<Paper
					component="form"
					sx={{ p: '2px 4px', display: 'flex', alignItems: 'center', width: 400 }}
					>
					<InputBase
						sx={{ ml: 1, flex: 1 }}
						placeholder="Search and filter results"
						inputProps={{ 'aria-label': 'Search and filter results' }}
						autoFocus
						onChange={(e) => filterResults(e.target.value)}
					/>
					<IconButton disabled type="submit" sx={{ p: '10px' }} aria-label="search">
						<SearchOutlined />
					</IconButton>
				</Paper>
			</div>
			{ singleNode && <SingleNodeViewer nodeData={singleNode}/> }
			{ resultRows.length > 0 ? 
			<div key="results-wrap" className="results-wrap">
				{/* <pre>{JSON.stringify(resultRows, null, 2)}</pre> */}

				<div className="table-wrap">
				<p className="pagination">
						Page: 
						{ pageNum > 0 && <span className="clickable" onClick={() => setPageNum(pageNum - 1)}>{ pageNum }</span> } 
						<span>{ pageNum + 1 }</span>
						{ !isLastPage && <span className="clickable" onClick={() => setPageNum(pageNum + 1)}>{ pageNum + 2 }</span> } 
						{ pageNum == 0 && !isBeforeLastPage && <span className="clickable" onClick={() => setPageNum(pageNum + 2)}>{ pageNum + 3 }</span> }
					</p>
					{
						resultRows.slice(pageNum * perPage, pageNum * perPage + perPage).map(row => (
							<div className="table-row">
								{ row.map(path => (
									<div className="path-segment">
										{
											path.map(obj => (
												obj.relationship == null ?
												<div className="object-wrap">
													<span className="object-label">{obj.entityType}</span>
													<span 
														className={`object-id ${obj.entityType.toLowerCase()}`}
														onClick={() => getNode(obj.primaryId)}
													>
														{obj.primaryId}
													</span>
												</div>
												:
												<div className="relation-wrap">
													<span className="object-label">Relation</span>
													<span className="object-id">{obj.relationship.type}</span>
												</div>
											))
										}
									</div>
								)) }
							</div>
						))
					}

					<p className="pagination">
						Page: 
						{ pageNum > 0 && <span className="clickable" onClick={() => setPageNum(pageNum - 1)}>{ pageNum }</span> } 
						<span>{ pageNum + 1 }</span>
						{ !isLastPage && <span className="clickable" onClick={() => setPageNum(pageNum + 1)}>{ pageNum + 2 }</span> } 
						{ pageNum == 0 && !isBeforeLastPage && <span className="clickable" onClick={() => setPageNum(pageNum + 2)}>{ pageNum + 3 }</span> }
					</p>
				</div>

				{/* <DataGrid
					key="results-table"
					disableSelectionOnClick={true}
					checkboxSelection={false}
					disableMultipleSelection={true}
					rows={resultRows.map(el => ({
						...el, 
						id : Object.values(el).join(''),
					}))}
					columns={ Object.keys(resultRows[0]).filter(key => {
							const [entityType, label, field] = key.split('__');
							return field != 'id';
						}).map(key => {
						const [entityType, label, field] = key.split('__');
						return (
							{
								renderCell: (params) => 
									
									<span className="single-link" onClick={() => getNode(params.value, entityType)}>{params.value}</span>
								,
								field: key,
								headerName: `${Utilities.capitalize(entityType)}: ${labels[label] || 'Unlabeled'}`,
								flex: 1,
								type: 'string'
							}
					)})}
					pageSize={20}
					rowsPerPageOptions={[20]}
				/> */}
			</div>
				:
				<p key="no-results-message">No results found</p>
			}
		</div>
	)
}