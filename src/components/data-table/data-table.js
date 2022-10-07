import React from "react";
import { Parser } from 'json2csv';
import { ExitToApp } from "@mui/icons-material";

export const DataTable = ({ rows, columns }) => {
	const tableToCsv = () => {
		const fields = columns.map(c => c.name);
		const opts = { fields };

		try {
			const parser = new Parser(opts);
			const csv = parser.parse(rows.map(row => columns.reduce((prev, curr) => {
				if (row[curr.key].props == null) {
					prev[curr.name] = row[curr.key];
				} else {
					prev[curr.name] = row[curr.key].props.children;
				}
				return prev
			}, {})));
			return csv;
		} catch (err) {
			console.error(err);
		}
	}

	return (
		<div className="data-table-wrap">
			<div className="export-header">
				<a
					href={URL.createObjectURL(new Blob([tableToCsv()], {type : 'text/csv'}))} 
					download={`data.csv`}
				> <ExitToApp/> Export to CSV </a>
			</div>
			<table className="data-table">
				<thead>
					<tr>
						{
							columns.map(col => <th>{col.name}</th>)
						}
					</tr>
				</thead>
				<tbody>
					{
						rows.map(row => (
							<tr>
								{
									columns.map(col => (<td>{row[col.key]}</td>))
								}
							</tr>
						))
					}
				</tbody>
			</table>
		</div>
	)
}