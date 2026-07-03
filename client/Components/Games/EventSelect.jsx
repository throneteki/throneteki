import React from 'react';
import { Select, SelectItem } from '@heroui/react';
import { useGetEventsQuery } from '../../redux/middleware/api';

const EventSelect = ({
    label = 'Event',
    placeholder,
    selected,
    onSelected,
    isInvalid,
    errorMessage,
    disallowEmptySelection,
    isDisabled
}) => {
    const { data } = useGetEventsQuery();
    const handleChange = (e) => {
        const newEvent = data.find((d) => d._id === e.target.value);
        onSelected(newEvent);
    };

    return (
        <Select
            label={label}
            selectedKeys={selected ? [selected] : []}
            placeholder={placeholder}
            onChange={handleChange}
            isInvalid={isInvalid}
            errorMessage={errorMessage}
            disallowEmptySelection={disallowEmptySelection}
            isDisabled={isDisabled}
        >
            {data?.map((d) => (
                <SelectItem key={d._id} value={d._id} textValue={d.name}>
                    {d.name}
                </SelectItem>
            ))}
        </Select>
    );
};

export default EventSelect;
