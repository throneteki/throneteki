import React, { useCallback } from 'react';

const Select = ({
    options,
    onChange,
    blankOption,
    valueKey,
    nameKey,
    button,
    name,
    labelClass,
    label,
    fieldClass,
    value,
    onBlur,
    validationMessage
}) => {
    const handleChange = useCallback(
        (event) => {
            let selectedValue = options.find((option) => {
                return option[valueKey || 'value'] === event.target.value;
            });

            onChange(selectedValue);
        },
        [onChange, options, valueKey]
    );

    let selectOptions = [];

    if (blankOption) {
        let value = blankOption[valueKey || 'value'];
        let name = blankOption[nameKey || 'name'];

        selectOptions.push(
            <option key='default' value={value}>
                {name}
            </option>
        );
    }

    if (options) {
        options.forEach((option) => {
            let value = option[valueKey || 'value'];
            let name = option[nameKey || 'name'];

            selectOptions.push(
                <option key={value} value={value}>
                    {name}
                </option>
            );
        });
    }

    let selectStyle = {};
    if (button) {
        selectStyle = {
            display: 'inline-block',
            width: '67%'
        };
    }

    return (
        <div className='form-group'>
            <label htmlFor={name} className={`${labelClass} control-label`}>
                {label}
            </label>
            <div className={fieldClass}>
                <select
                    style={selectStyle}
                    className='form-control'
                    id={name}
                    value={value}
                    onChange={handleChange}
                    onBlur={onBlur}
                >
                    {selectOptions}
                </select>
                {validationMessage ? (
                    <span className='help-block'>{validationMessage} </span>
                ) : null}
                {button ? (
                    <button className='btn btn-default select-button' onClick={button.onClick}>
                        {button.text}
                    </button>
                ) : null}
            </div>
        </div>
    );
};

export default Select;
