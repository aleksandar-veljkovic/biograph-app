import { Close } from "@mui/icons-material"

export const PropertyItem = ({ property, onRemove, propertyIndex, availableProperties=[] }) => {
    return (
        <div
            className="property-item"
            key={`property-${propertyIndex}`}
        >
            {/* Property field */}
            {/* <input className="selected-property-field property-key" type="text" disabled value={availableProperties.find(p => p.value === property.field).label} /> */}
            <select
                key={`field-${propertyIndex}`}
                defaultValue={'-'}
                // onChange={(e) => { pendingProperty.current.field = e.target.value }}
                className="property-key"
            >
                <option disabled value="-">-</option>
                {
                    // availableProperties.map(availableProperty => (
                    //     <option key={`${propertyIndex},create,${availableProperty.value}}`} value={availableProperty.value}>{availableProperty.label}</option>
                    // ))
                }
            </select>

            {/* Property operator */}
            <select
                key={`operator-${propertyIndex}`}
                className="operator"
                // onChange={(e) => { pendingProperty.current.operator = e.target.value }}
            >
                <option default value="EQ">=</option>
                <option default value="GT">{'>'}</option>
                <option default value="GTE">{'≥'}</option>
                <option default value="LT">{'<'}</option>
                <option default value="LTE">{'≤'}</option>
            </select>

            {/* Property value */}
            <input
                type="text"
                // defaultValue={property.value}
            />

            <button className="property-button remove" onClick={() => onRemove(propertyIndex)}><Close /></button>
        </div>
    )
}