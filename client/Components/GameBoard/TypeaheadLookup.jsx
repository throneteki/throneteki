import React, { useState, useCallback, useMemo } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';
import { useAdaptiveBoard } from './adaptiveContext';
import { chipClass } from './Adaptive/chipClass';

const TypeaheadLookup = ({ onValueSelected, values }) => {
    const adaptive = useAdaptiveBoard();
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
                {adaptive ? (
                    <Button
                        variant='bordered'
                        className={`${chipClass(false)} h-9 w-full`}
                        onPress={handleDoneClick}
                        disableRipple
                    >
                        Done
                    </Button>
                ) : (
                    <Button onPress={handleDoneClick} color='primary'>
                        Done
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TypeaheadLookup;
