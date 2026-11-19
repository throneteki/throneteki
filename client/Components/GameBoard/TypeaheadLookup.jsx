import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@heroui/react';
import ComboField from '../Site/ComboField';

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
        return values.map((value) => ({ id: value, label: value }));
    }, [values]);

    return (
        <div>
            <ComboField
                className='mt-2 px-2'
                aria-label='Choose a value'
                items={labelsAndValues}
                selectedKey={selectedValue || null}
                onSelectionChange={handleChange}
            />
            <div className='mt-2 mx-2 flex flex-col mb-2'>
                <Button onPress={handleDoneClick} variant='primary'>
                    Done
                </Button>
            </div>
        </div>
    );
};

export default TypeaheadLookup;
