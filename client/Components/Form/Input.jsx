import React from 'react';

const Input = ({
    children,
    fieldClass,
    label,
    labelClass,
    name,
    noGroup,
    onBlur,
    onChange,
    placeholder,
    type,
    validationAttributes,
    value
}) => {
    const inputControl = (
        <div>
            <label htmlFor={name} className={`${labelClass} control-label`}>
                {label}
            </label>
            <div className={fieldClass}>
                <input
                    name={name}
                    type={type}
                    className='form-control'
                    id={name}
                    placeholder={placeholder}
                    value={value}
                    onChange={onChange}
                    onBlur={onBlur}
                    {...validationAttributes}
                />
                <span className='text-danger' data-valmsg-replace='true' data-valmsg-for={name} />
            </div>
            {children}
        </div>
    );

    if (noGroup) {
        return inputControl;
    }

    return <div className='form-group'>{inputControl}</div>;
};

export default Input;
