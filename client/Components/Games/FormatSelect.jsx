import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import { GameFormats } from '../../constants';

const FormatSelect = ({
    className,
    style,
    label = 'Format',
    selected,
    onSelected,
    isInvalid,
    errorMessage,
    disallowEmptySelection,
    isDisabled
}) => {
    const handleChange = (e) => {
        onSelected(e.target.value);
    };

    return (
        <Select
            label={label}
            selectedKeys={selected ? [selected] : []}
            onChange={handleChange}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            disallowEmptySelection={disallowEmptySelection}
            isDisabled={isDisabled}
            className={className}
            style={style}
        >
            {GameFormats.map((f) => (
                <SelectItem key={f.name} value={f.name}>
                    {f.label}
                </SelectItem>
            ))}
        </Select>
    );
};

export default FormatSelect;
