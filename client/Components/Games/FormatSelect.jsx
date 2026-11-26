import React from 'react';
import SelectField from '../Site/SelectField';
import { GameFormats } from '../../constants';

const FormatSelect = ({
    className,
    style,
    label = 'Format',
    selected,
    onSelected,
    isInvalid,
    errorMessage,
    isDisabled
}) => {
    const handleChange = (value) => {
        onSelected(value);
    };

    return (
        <SelectField
            label={label}
            value={selected || null}
            onChange={handleChange}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            className={className}
            style={style}
            items={GameFormats.map((f) => ({ id: f.name, label: f.label }))}
        />
    );
};

export default FormatSelect;
