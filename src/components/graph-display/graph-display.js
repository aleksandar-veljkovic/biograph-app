import React, { useState, useContext, useEffect } from 'react';
import { GraphContext } from '../../contexts/graph-context';
import { PlayCircleOutline } from '@mui/icons-material';

import ReactFlow, {
  MiniMap,
  Background,
	useZoomPanHelper,
} from 'react-flow-renderer';

import { GraphNode } from "./graph-node";
import { GraphEdge } from "./graph-edge";
import { QueryContext } from '../../contexts/query-context';

export const GraphDisplay = ({ onQuery }) => {
	const { project } = useZoomPanHelper();
	const { nodes, edges, createNode,  createEdge, getNode, availableNodeProperties, edgeSchema, themes, prepareQuery } = useContext(GraphContext);
	const { results, rawQuery } = useContext(QueryContext);

	useEffect(() => {
		rawQuery.current = JSON.stringify({ nodes, edges }, null, 2);
	}, [nodes, edges]);

	/** 
	 * Fit graph to window
	 **/ 
	const onLoad = (reactFlowInstance) => {
		reactFlowInstance.fitView();
	};

	/**
	 * Add new node
	 * @param {*} params 
	 */
	 const addNewNode = (params) => {
		const { x, y } = project( { x: params.clientX, y: params.clientY - 30 } );
		createNode(x, y);
	}

	/**
	 * On nodes connected
	 * @param {} params 
	 */
  const onConnect = (params) => {
		createEdge(params);
	};

	/**
	 * Generate graph query from drawing
	 */
	const generateQuery = () => {
		const match = [];
		const params = {};

		let numEdges = 0;
		
		for (const edge of edges) {
			const { sourceNode, targetNode, id: edgeId, data: { edgeType } } = edge;
			// labels[sourceNode.data.defaultLabel] = sourceNode.data.label;
			// labels[targetNode.data.defaultLabel] = targetNode.data.label;

			if (edgeType != null) {
				numEdges += 1;
				const pattern = `(${sourceNode.data.defaultLabel}:${sourceNode.data.entityType})-[${edgeId}:${edgeType}]-(${targetNode.data.defaultLabel}:${targetNode.data.entityType})`;
				match.push(pattern);

				const edgeProperties = [];
				for (const property of edge.data.properties) {
					const fromType = sourceNode.data.entityType;
					const toType = targetNode.data.entityType;
					console.log(fromType, toType, edgeSchema[fromType][toType].find(p => p.edgeType === edgeType));
					const { isNumeric } = (edgeSchema[fromType][toType].find(p => p.edgeType === edgeType) || {properties: []}).properties.find(prop => prop.value == property.field)
					edgeProperties.push({
						field: property.field,
						op: property.operator,
						value: isNumeric ? parseFloat(property.value) : property.value,
						isNumber: isNumeric,
					});
				}

				params[edgeId] = {
					identifiers: [],
					data: edgeProperties,
				}
			}
		}

		// const returns = nodes.filter(n => n.data.isIncluded).map(n => n.data.defaultLabel);
		// if (returns.length == 0) {
		// 	return;
		// }

		let numNodes = 0;
		for (const node of nodes) {
				if (node.data.entityType == "unselected") {
				continue;
			}
			numNodes += 1;

		// 	if (labels[node.data.defaultLabel] == null) {
		// 		labels[node.data.defaultLabel] = node.data.label;
		// 	}

			params[node.data.defaultLabel] = { identifiers: [], data: []};
			for (const property of node.data.properties) {
				const propertyInfo = availableNodeProperties[node.data.entityType].find(p => p.value === property.field);
				if (propertyInfo.identifier) {
					params[node.data.defaultLabel].identifiers.push({ value: property.value });
				} else {
					params[node.data.defaultLabel].data.push({ 
						field: property.field, 
						op: property.operator, 
						value: propertyInfo.isNumeric ? parseFloat(property.value) : property.value, 
						isNumber: propertyInfo.isNumeric
					})
				}
			}
		}

		if (numNodes > 1 && numEdges < numNodes - 1) {
			console.log('All nodes need to be connected');
			return;
		}

		if (numNodes == 1 && numEdges == 0) {
			const singleNode = nodes[0];
			match.push(`(${singleNode.data.defaultLabel}:${singleNode.data.entityType})`)
		}

		const query = {
			match,
			// returns,
			params,
			// labels,
		}

		// console.log(JSON.stringify(query,null,2));

		onQuery(query);
	}

  return (
			<div className="graph-display">
				{ nodes.length == 0 && <h2 className="display-title">Click anywhere to start drawing query pattern</h2> }
					<ReactFlow
						elements={nodes.concat(edges)}
						// onNodeDoubleClick={(e, elem) => onElementsRemove([elem])}
						onConnect={onConnect}
						onLoad={onLoad}
						snapToGrid={true}
						snapGrid={[15, 15]}
						connectionMode="loose"
						onPaneClick={addNewNode}
						nodeTypes={{'graphNode': GraphNode}}
						edgeTypes={{'graphEdge': GraphEdge}}
					>
						<MiniMap
							nodeStrokeColor={(n) => {
								// if (n.style?.background) return n.style.background;
								// if (n.type === 'input') return '#0041d0';
								// if (n.type === 'output') return '#ff0072';
								// if (n.type === 'default') return '#1a192b';

								// return '#eee';
								if (n.data.entityType == null) {
									return '#dedede';
								} 
								return themes[n.data.entityType].color
							}}
							nodeColor={(n) => {
								// if (n.style?.background) return n.style.background;

								// return '#ededed';
								if (n.data.entityType == null) {
									return '#ededed';
								} 
								return themes[n.data.entityType].colorLight
							}}
							nodeBorderRadius={3}
						/>
						{/* <Controls /> */}
						<Background color="#aaa" gap={16} />
					</ReactFlow>

					<button className="run-query" onClick={(e) => {
						e.stopPropagation(); 
						generateQuery();
					}}><PlayCircleOutline className="query-icon" />Run Query</button>
					{
						results && 
						<button className="goto-results" onClick={(e) => {
							e.stopPropagation();
							window.scrollTo(0, document.getElementById('results-start').offsetTop, 100);
						}}>
						View Results
						</button>
					}
			</div>
  );
};