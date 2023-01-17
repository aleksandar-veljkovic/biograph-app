import {DebounceInput} from 'react-debounce-input';

export const IconInput = ({ inputRef, icon, className, debounceTimeout, minLength, ...props}) => {
    return (
        <span className={`icon-input ${className || ''}`}>
            {
                debounceTimeout != null ?
                   <DebounceInput ref={inputRef} debounceTimeout={debounceTimeout} minLength={minLength | 2} className="icon-input-field" {...props} />
                   :
                   <input ref={inputRef} className="icon-input-field" {...props} />
            }
            <span className="icon">{ icon }</span>
        </span>
    )
}