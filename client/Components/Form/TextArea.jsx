import React, { useCallback } from 'react';

const TextArea = ({
    labelClass: labelClassProp,
    name,
    fieldClass,
    rows,
    placeholder,
    value,
    onChange: onChangeProp,
    onBlur: onBlurProp,
    validationAttributes,
    label,
    children
}) => {
    let labelClass = 'control-label';
    if (labelClassProp) {
        labelClass += ` ${labelClassProp}`;
    }

    const onChange = useCallback(
        (event) => {
            if (onChangeProp) {
                onChangeProp(event);
            }
        },
        [onChangeProp]
    );

    const onBlur = useCallback(
        (event) => {
            if (onBlurProp) {
                onBlurProp(event);
            }
        },
        [onBlurProp]
    );

    return (
        <div className='form-group'>
            <label htmlFor={name} className={labelClass}>
                {label}
            </label>
            <div className={fieldClass}>
                <textarea
                    id={name}
                    name={name}
                    rows={rows}
                    className='form-control'
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
};

export default TextArea;
