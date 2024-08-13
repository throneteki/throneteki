import React, { useState, useCallback, useMemo } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@nextui-org/react';

const TypeaheadLookup = ({ onValueSelected, values }) => {
    const [selectedValue, setSelectedValue] = useState('');

    const handleChange = useCallback((value) => {
        setSelectedValue(value[0]);
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
                className='px-1 mt-2'
                defaultItems={labelsAndValues}
                inputProps={{ classNames: { inputWrapper: 'rounded-md' } }}
            >
                {(item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>}
            </Autocomplete>
            {/* <Typeahead labelKey={'label'} options={values} dropup onChange={handleChange} /> */}
            <div className='mt-2 px-1'>
                <Button onClick={handleDoneClick} color='primary'>
                    Done
                </Button>
            </div>
        </div>
    );
};

export default TypeaheadLookup;
