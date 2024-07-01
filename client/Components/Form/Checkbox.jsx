import React from 'react';

const Checkbox = ({
    checked,
    children,
    fieldClass,
    label,
    labelClass,
    name,
    noGroup,
    onChange
}) => {
    const checkBox = (
        <div className={`checkbox ${fieldClass}`}>
            <label htmlFor={name} className={labelClass}>
                <input type='checkbox' id={name} checked={checked} onChange={onChange} />
                {label}
            </label>
            {children}
        </div>
    );

    if (noGroup) {
        return checkBox;
    }

    return <div className='form-group'>{checkBox}</div>;
};

export default Checkbox;
