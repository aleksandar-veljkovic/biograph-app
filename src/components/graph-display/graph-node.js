import React, { useContext, useRef, useState } from "react";
import { Handle } from 'react-flow-renderer';
import { DeleteOutline, Close, Add, CloseOutlined } from "@mui/icons-material";
import { GraphContext } from "../../contexts/graph-context";

export function GraphNode({ id, data }){
	const {
		isIncluded,
		entityType: type,
		label,
		properties,
	} = data;

	const entityType = type || 'unselected';
	const pendingProperty = useRef({ field: null, operator: 'EQ', value: null});
	const [propertiesVisible, setPropertiesVisible] = useState(true);

	const { 
		themes,
		availableNodeProperties,
		toggleNodeIncluded,
		setNodeEntityType,
		setNodeLabel,
		removeNode,
		updateNodeProperty,
		addNodeProperty,
		removeNodeProperty,
	} = useContext(GraphContext);

	const availableProperties = availableNodeProperties[entityType];
	const nodeTheme = themes[entityType];

	const addProperty = () => {
		const { field, operator, value} = pendingProperty.current;

		if (field && operator && value) {
			addNodeProperty(id, field, operator, value);
			pendingProperty.current = { field: null, operator: 'EQ', value: null};
		}
	};

	return (
		<div 
			className="graph-node" 
			style={{...(isIncluded && {borderColor: nodeTheme.color, borderWidth: '2px'})}}
		>

			{/* Include entity */}
			{/* <div className="include-entity">
				<span>Include in results</span>
				<input 
					disabled={entityType === 'unselected'}
					onDoubleClick={(e) => e.stopPropagation()} 
					type="checkbox"
					defaultChecked={isIncluded}
					onChange={() => toggleNodeIncluded(id)}
				/>
			</div> */}

			{/* Node header */}
			<div className="graph-node-header">

				<div className="graph-node-handle" style={{ backgroundColor: nodeTheme.color }}>
					<span className="node-type">
						{ entityType }
					</span>
				
					{/* Remove node */}
					<div 
						className="remove-entity"
						onClick={(e) => {e.stopPropagation(); removeNode(id)}}
						onTouchEnd={(e) => {e.stopPropagation(); removeNode(id)}}
					>
						<span><CloseOutlined/></span>
					</div>
				</div>
				
				<div className="graph-node-header-wrapper">
					{/* Icon */}
					<div 
						className="graph-node-icon"
						style={{ backgroundColor: nodeTheme.color }}
					>
						<img src={nodeTheme.icon} alt={entityType || 'unselected'}/>
					</div>

					{/* Entity type */}
					<div className="graph-node-info">
						<select 
							className="graph-node-type-select"
							onChange={(e) => setNodeEntityType(id, e.target.value)}
							value={entityType}
							onTouchEnd={(e) => {
								const event = new MouseEvent('mousedown');
								e.target.dispatchEvent(event);
							}}
						>
							<option value='unselected' disabled>Select type</option>
							<option value="Gene">Gene</option>
							<option value="Protein">Protein</option>
							<option value="Disease">Disease</option>
							<option value="Antigen">Tumor antigen</option>
							<option value="Epitope">Epitope</option>
						</select>
						<label>Entity type</label>
					</div>
				</div>
			</div>

		{ entityType != 'unselected' && propertiesVisible &&
			<>
			{/* Node properties */}
			<div className="graph-node-properties">

				{/* Node label */}
					{/* <input 
						placeholder="Unlabeled" 
						className="node-label" 
						type="text"
						onChange={(e) => setNodeLabel(id, e.target.value.trim())}
						onDoubleClick={(e) => e.stopPropagation()}
					/><br/>
					<label>Node label</label> */}

					<label>Node properties</label>

					{/* List of requested properties */}
					<div className="property-list">
						{
							properties.map((property, index) => (
								<div 
									className="property-item" 
									key={`${id},${index},${property.field},${property.operator},${property.value}`}
								>
									{/* Property field */}
									<input className="selected-property-field property-key" type="text" disabled value={availableProperties.find(p => p.value === property.field).label}/>
									
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

									<button className="property-button remove" onClick={() => removeNodeProperty(id, index)}><Close/></button>
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
								className="property-key"
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
								<option default value="LTE">{'≤'}</option>
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

				<Handle
					type="source"
					position="bottom"
					style={{
						backgroundColor: nodeTheme.color,
						borderColor: nodeTheme.colorLight,
					}}
					id="b"
					className="node-handle"
					onTouchStart={(e) => {
						const event = new MouseEvent('dragstart')
						e.target.dispatchEvent(event);
					}}
					onTouchEnd={(e) => {
						const event = new MouseEvent('dragend')
						e.target.dispatchEvent(event);
					}}
				/>
			</div>
			</>
		}
		</div>
	);
}