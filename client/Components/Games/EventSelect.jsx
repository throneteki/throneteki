import React from 'react';
import SelectField from '../Site/SelectField';
import { useGetEventsQuery } from '../../redux/middleware/api';

const EventSelect = ({
    label = 'Event',
    placeholder,
    selected,
    onSelected,
    isInvalid,
    errorMessage,
    isDisabled,
    className,
    'aria-label': ariaLabel
}) => {
    const { data } = useGetEventsQuery();
    const handleChange = (value) => {
        const newEvent = data.find((d) => d._id === value);
        onSelected(newEvent);
    };

    return (
        <SelectField
            label={label}
            value={selected || null}
            placeholder={placeholder}
            onChange={handleChange}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            isDisabled={isDisabled}
            className={className}
            aria-label={ariaLabel}
            items={(data || []).map((d) => ({ id: d._id, label: d.name }))}
        />
    );
};

export default EventSelect;
