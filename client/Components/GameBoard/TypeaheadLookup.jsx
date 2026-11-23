import React, { useState, useCallback, useMemo } from 'react';
import { Autocomplete, AutocompleteItem, Button } from '@heroui/react';
import { useAdaptiveBoard } from './adaptiveContext';
import { chipClass } from './Adaptive/chipClass';

// compact: on one line, the size of the prompt's other options, for a prompt bar with no room to spare, its input as
// wide as width (CSS) and clearable or not. placeholder: what to choose, on the adaptive board.
const TypeaheadLookup = ({
    onValueSelected,
    values,
    compact = false,
    width,
    clearable = true,
    placeholder
}) => {
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

    const items = (item) => <AutocompleteItem key={item.value}>{item.label}</AutocompleteItem>;

    if (compact) {
        return (
            <div className='flex min-w-0 items-center gap-1'>
                <div className='min-w-0' style={{ width }}>
                    <Autocomplete
                        aria-label={placeholder}
                        placeholder={placeholder}
                        size='sm'
                        isClearable={clearable}
                        className='w-full'
                        defaultItems={labelsAndValues}
                        onSelectionChange={handleChange}
                        inputProps={{
                            classNames: {
                                inputWrapper: 'h-7 min-h-7 rounded-md py-0',
                                input: 'text-xs'
                            }
                        }}
                    >
                        {items}
                    </Autocomplete>
                </div>
                <Button
                    type='button'
                    size='sm'
                    variant='bordered'
                    className={`${chipClass(false)} h-7 shrink-0`}
                    onPress={handleDoneClick}
                    isDisabled={!selectedValue}
                    disableRipple
                >
                    Done
                </Button>
            </div>
        );
    }

    return (
        <div>
            <Autocomplete
                aria-label={adaptive ? placeholder : undefined}
                placeholder={adaptive ? placeholder : undefined}
                className='px-2 mt-2'
                defaultItems={labelsAndValues}
                onSelectionChange={handleChange}
                inputProps={{ classNames: { inputWrapper: 'rounded-md' } }}
            >
                {items}
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
