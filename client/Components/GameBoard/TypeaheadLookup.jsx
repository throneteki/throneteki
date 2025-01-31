import React, { useState, useCallback, useMemo } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';

const TypeaheadLookup = ({ onValueSelected, values }) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = useCallback((value) => {
        setSelectedValue(value);
    }, []);

    const handleDoneClick = useCallback(() => {
        if (onValueSelected) {
            onValueSelected(selectedValue);
        }
    }, [onValueSelected, selectedValue]);

    const labelsAndValues = useMemo(() => {
        return values.map((value) => ({ label: value, value }));
    }, [values]);

    return (
        <div>
            <Autocomplete
                className='px-2 mt-2'
                defaultItems={labelsAndValues}
                onSelectionChange={handleChange}
                inputProps={{ classNames: { inputWrapper: 'rounded-md' } }}
            >
                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
            </Autocomplete>
            <div className='mt-2 mx-2 flex flex-col mb-2'>
                <Button onPress={handleDoneClick} color='primary'>
                    Done
                </Button>
            </div>
        </div>
    );
};

export default TypeaheadLookup;
