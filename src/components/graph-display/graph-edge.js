import React, {useContext, useRef} from 'react';
import {
  getBezierPath,
  getEdgeCenter,
	updateEdge,
} from 'react-flow-renderer';
import { DeleteOutline, Close, Add } from "@mui/icons-material";
import { GraphContext } from "../../contexts/graph-context";

import GraphService from '../../services/graph/graph';

export function GraphEdge({ 
  id, 
  sourceX, 
  sourceY, 
  targetX, 
  targetY,
  sourcePosition, 
  targetPosition,
  style: edgeStyle,
  data }) {

	const pendingProperty = useRef({ field: null, operator: 'EQ', value: null});

	const {
		removeEdge,
		addEdgeProperty,
		removeEdgeProperty,
		setEdgeType,
		edgeSchema,
		reverseEdge,
		getEdge,
	} = useContext(GraphContext);

	const style = edgeStyle || {};

	const edge = getEdge(id);

	let relations = [];
	let availableProperties = []
	let properties = [];
	let edgeType = null;

	if (edge) {
		edgeType = edge.data.edgeType;
		relations = edgeSchema[edge.sourceNode.data.entityType][edge.targetNode.data.entityType] || [];
		if (relations.length == 0 && !edge.reversed) {
			reverseEdge(id);
		} else {
			properties = edge.data.properties;
			if (edge.data.edgeType != null) {
				const edgeMeta = relations.find(e => e.edgeType == edge.data.edgeType);

				if  (edgeMeta == null) {
					setEdgeType(id, null);
					updateEdge(id, {properties: []})
				} else {
					availableProperties = edgeMeta.properties;
				}
			}
		}
	}

	const addProperty = () => {
		const { field, operator, value} = pendingProperty.current;

		if (field && operator && value) {
			addEdgeProperty(id, field, operator, value);
			pendingProperty.current = { field: null, operator: 'EQ', value: null};
		}
	};
	

  const calcPosition = (sourceX, sourceY, targetX, targetY, edgeCenterX, edgeCenterY) => {
    let x, y;

    x = edgeCenterX - 100;
    y = edgeCenterY - 100;

    return { x, y };
  }

  const edgePath = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });
  const [edgeCenterX, edgeCenterY] = getEdgeCenter({
    sourceX,
    sourceY,
    targetX,
    targetY,
  });

	return (
    <>
        <path
					id={id}
					style={style}
					className="react-flow__edge-path"
					d={edgePath}
				/>
				<foreignObject
					width={250}
					height={180 + properties.length * 41}
					x={calcPosition(sourceX, sourceY, targetX, targetY, edgeCenterX, edgeCenterY).x}
					y={calcPosition(sourceX, sourceY, targetX, targetY, edgeCenterX, edgeCenterY).y}
				>
					<body className="graph-edge-wrap">
						<div className="remove-edge">
							<span
								onClick={(e) => { e.stopPropagation(); removeEdge(id)} }
							>Remove <DeleteOutline/></span>
						</div>
						<div className={`graph-edge ${edgeType == null ? 'unselected' : ''}`} style={{ height: `${100 + properties.length * 41 - 20 + (availableProperties.length > 0 ? 40 : 0)}px` }}>
							<div className="graph-edge-header">
								<select defaultValue={data.edgeType} className="graph-node-type-select" onChange={(e)=>setEdgeType(id, e.target.value)}>
									<option value="">Select type</option>
									{
										relations.map(e => (
											<option value={e.edgeType}>{e.label}</option>
										))
									}
								</select>
								<label>Edge type</label>
							</div>	

							{/* List of requested properties */}
					{ availableProperties.length > 0 && 
						<div className="property-list">
							{
								properties.map((property, index) => (
									<div 
										className="property-item" 
										key={`${id},${index},${property.field},${property.operator},${property.value}`}
									>
										{/* Property field */}
										<input className="selected-property-field" type="text" disabled value={availableProperties.find(p => p.value === property.field).label}/>
										
										{/* Property operator */}
										<input type="text" className="selected-property-operator" disabled value={(() => {
											switch(property.operator) {
												case 'EQ': return '=';
												case 'LT': return '<';
												case 'LTE': return '≤';
												case 'GT': return '>';
												case 'GTE': return '≥';
												default: return '';
											}
										})()
										}/>
								
										{/* Property value */}
										<input 
											type="text" 
											defaultValue={property.value}
											disabled
										/>

										<button className="property-button remove" onClick={() => removeEdgeProperty(id, index)}><Close/></button>
									</div>
								))
							}

							{/* Add new property */}
							<div className="property-item">
								{/* Property field */}
								<select 
									key={`add-field-${properties.length}`}
									defaultValue={'-'}
									onChange={(e) => { pendingProperty.current.field = e.target.value }}
								>
									<option disabled value="-">-</option>
									{
										availableProperties.map(availableProperty => (
											<option key={`${id},create,${availableProperty.value}}`} value={availableProperty.value}>{availableProperty.label}</option>
										))
									}
								</select>

								{/* Property operator */}
								<select 
									key={`add-operator-${properties.length}`}
									className="operator" 
									onChange={(e) => { pendingProperty.current.operator = e.target.value }}
								>
									<option default value="EQ">=</option>
									<option default value="GT">{'>'}</option>
									<option default value="GTE">{'≥'}</option>
									<option default value="LT">{'<'}</option>
									<option default value="LT">{'≤'}</option>
								</select>

								{/* Property value */}
								<input 
									key={`add-value-${properties.length}`}
									type="text" 
									defaultValue=''
									onChange={(e) => { pendingProperty.current.value = e.target.value }}
								/>

								<button className="property-button add" onClick={() => addProperty()}><Add/></button>
							</div>
						</div>
						}
						</div>
					</body>
				</foreignObject>
      </>
  );
}