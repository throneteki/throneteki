import React from 'react';
import SelectField from '../Site/SelectField';
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
            renderValue={(key) => (
                <div className='flex gap-2 items-center'>
                    <ThronesIcon icon={key} />
                    <div>{Constants.Factions.find((f) => f.value === key)?.name}</div>
                </div>
            )}
            items={Constants.Factions.map((f) => ({
                id: f.value,
                label: f.name,
                content: (
                    <div className='flex gap-2 items-center'>
                        <ThronesIcon icon={f.value} />
                        <div>{f.name}</div>
                    </div>
                )
            }))}
        />
    );
};

export default FactionSelect;
