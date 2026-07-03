import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import { Constants } from '../../constants';
import ThronesIcon from '../GameBoard/ThronesIcon';

const FactionSelect = ({
    className,
    style,
    label = 'Faction',
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
            renderValue={([f]) => (
                <div className='flex gap-2 items-center'>
                    <ThronesIcon icon={f.key} />
                    <div>{f.textValue}</div>
                </div>
            )}
        >
            {Constants.Factions.map((f) => (
                <SelectItem key={f.value} value={f.value} textValue={f.name}>
                    <div className='flex gap-2 items-center'>
                        <ThronesIcon icon={f.value} />
                        <div>{f.name}</div>
                    </div>
                </SelectItem>
            ))}
        </Select>
    );
};

export default FactionSelect;
