import React, { useState, useCallback, useMemo } from 'react';
import { Button } from '@heroui/react';
import ComboField from '../Site/ComboField';
import { useAdaptiveBoard } from './adaptiveContext';
import { chipClass } from './Adaptive/chipClass';

// compact: on one line, the size of the prompt's other options, for a prompt bar with no room to spare, its input as
// wide as width (CSS). placeholder: what to choose, on the adaptive board.
const TypeaheadLookup = ({ onValueSelected, values, compact = false, width, placeholder }) => {
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
        return values.map((value) => ({ id: value, label: value }));
    }, [values]);

    if (compact) {
        return (
            <div className='flex min-w-0 items-center gap-1'>
                <div className='min-w-0' style={{ width }}>
                    <ComboField
                        className='w-full'
                        inputClassName='h-7 min-h-7 py-0 text-xs'
                        aria-label={placeholder}
                        placeholder={placeholder}
                        items={labelsAndValues}
                        selectedKey={selectedValue || null}
                        onSelectionChange={handleChange}
                    />
                </div>
                <Button
                    type='button'
                    size='sm'
                    variant='outline'
                    className={`${chipClass(false)} h-7 shrink-0`}
                    onPress={handleDoneClick}
                    isDisabled={!selectedValue}
                >
                    Done
                </Button>
            </div>
        );
    }

    return (
        <div>
            <ComboField
                className='mt-2 px-2'
                aria-label={placeholder || 'Choose a value'}
                placeholder={adaptive ? placeholder : undefined}
                items={labelsAndValues}
                selectedKey={selectedValue || null}
                onSelectionChange={handleChange}
            />
            <div className='mt-2 mx-2 flex flex-col mb-2'>
                {adaptive ? (
                    <Button
                        variant='outline'
                        className={`${chipClass(false)} h-9 w-full`}
                        onPress={handleDoneClick}
                    >
                        Done
                    </Button>
                ) : (
                    <Button onPress={handleDoneClick} variant='primary'>
                        Done
                    </Button>
                )}
            </div>
        </div>
    );
};

export default TypeaheadLookup;
