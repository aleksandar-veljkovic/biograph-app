import React, { useContext, useRef, useState } from "react";
import { Handle } from 'react-flow-renderer';
import { DeleteOutline, Close, Add, CloseOutlined, Search } from "@mui/icons-material";
import { GraphContext } from "../../contexts/graph-context";
import { IconInput } from "../icon-input/icon-input";
import { PropertyItem } from "../property-item/property-item";
import { SearchAutocomplete } from "../search-autocomplete/search-autocomplete";

export function GraphNode({ id, data }) {
	const {
		isIncluded,
		entityType: type,
		label,
		properties,
	} = data;

	const entityType = type || 'unselected';
	const pendingProperty = useRef({ field: null, operator: 'EQ', value: null });
	const [propertiesVisible, setPropertiesVisible] = useState(true);
	const [propertyItems, setPropertyItems] = useState([]);

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
		setNodeProperties,
	} = useContext(GraphContext);

	const availableProperties = availableNodeProperties[entityType];
	const nodeTheme = themes[entityType];

	const addProperty = () => {
		const { field, operator, value } = pendingProperty.current;

		if (field && operator && value) {
			addNodeProperty(id, field, operator, value);
			pendingProperty.current = { field: null, operator: 'EQ', value: null };
		}
	};

	return (
		<div
			className="graph-node"
			style={{ ...(isIncluded && { borderColor: nodeTheme.color, borderWidth: '2px' }) }}
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
						. . . .
					</span>

					{/* Remove node */}
					<div
						className="remove-entity"
						onClick={(e) => { e.stopPropagation(); removeNode(id) }}
						onTouchEnd={(e) => { e.stopPropagation(); removeNode(id) }}
					>
						<span><CloseOutlined /></span>
					</div>
				</div>

				<div className="graph-node-header-wrapper nodrag">
					{/* Icon */}
					<div
						className="graph-node-icon"
						style={{ backgroundColor: nodeTheme.color }}
					>
						<img src={nodeTheme.icon} alt={entityType || 'unselected'} />
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

			{entityType != 'unselected' && propertiesVisible &&
				<>
					{/* Node properties */}
					<div className="graph-node-properties nodrag">

						{/* Node label */}
						{/* <input 
						placeholder="Unlabeled" 
						className="node-label" 
						type="text"
						onChange={(e) => setNodeLabel(id, e.target.value.trim())}
						onDoubleClick={(e) => e.stopPropagation()}
					/><br/>
					<label>Node label</label> */}

						{/* Search field */}
						<label>Search</label>
						{/* <IconInput
							className="search-input"
							type="text"
							placeholder="Search by names, identifiers, keywords"
							icon={<Search />}
						/> */}
						<SearchAutocomplete 
							onSelected={(primaryId) => setNodeProperties(id, [{field: "identifier", operator: "EQ", value: primaryId}])}
							entityType={entityType}
						/>

						{/* List of requested properties */}
						{properties.length > 0 &&
							<>
								<label>{entityType} Properties</label>
								<div className="property-list nodrag">
									<div className="property-list-header">
										<span>Property name</span>
										<span>Relation</span>
										<span>Value</span>
									</div>

									<div className="property-items">
										{
											properties.map((property, index) => (
												// <PropertyItem propertyIndex={index} onRemove={() => {
												// 	console.log(index);
												// 	propertyItems.splice(index, 1);
												// 	setPropertyItems([...propertyItems]);
												// }}/>
												<div
													className="property-item"
													key={`${id},${index},${property.field},${property.operator},${property.value}`}
												>
													{/* Property field */}
													{/* <input className="selected-property-field property-key" type="text" disabled value={availableProperties.find(p => p.value === property.field).label} /> */}
													<select
														key={`add-field-${properties.length}`}
														defaultValue={property.field || '-'}
														// onChange={(e) => { pendingProperty.current.field = e.target.value }}
														onChange={(e) => updateNodeProperty(id, index, e.target.value, property.operator, property.value)}
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
														key={`${id}-operator-${index}`}
														className="operator"
														defaultValue={property.operator || 'EQ'}
														onChange={(e) => {
															console.log(e.target.value)
															updateNodeProperty(id, index, property.field, e.target.value, property.value, false)
														}}
													>
														<option default value="EQ">=</option>
														<option default value="GT">{'>'}</option>
														<option default value="GTE">{'≥'}</option>
														<option default value="LT">{'<'}</option>
														<option default value="LTE">{'≤'}</option>
													</select>

													{/* Property value */}
													<input
														key={`${id}-field-${index}`}
														type="text"
														defaultValue={property.value}
														onChange={(e) => updateNodeProperty(id, index, property.field, property.operator, e.target.value, true)}
													/>

													<button className="property-button remove" onClick={() => removeNodeProperty(id, index)}><Close /></button>
												</div>
											))
										}
									</div>
								</div>
							</>
						}

						{availableProperties.length > 0 &&
							<span
								className="add-property-button"
								style={{ color: nodeTheme.color }}
								onClick={() => addNodeProperty(id, null, 'EQ', null)}
							>
								+ Add property
							</span>
						}

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