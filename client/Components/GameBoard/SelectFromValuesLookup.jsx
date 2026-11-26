import React from 'react';

import TypeaheadLookup from './TypeaheadLookup';

const SelectFromValuesLookup = (props) => {
    const longest = Math.max(1, ...props.selectableValues.map((value) => value.length));
    return (
        <TypeaheadLookup
            values={props.selectableValues}
            onValueSelected={props.onValueSelected}
            compact={props.compact}
            // Room for the longest value and the list's arrow: most are a number of a digit or two
            width={`calc(${longest}ch + 3.5rem)`}
            placeholder={props.compact ? 'X' : 'Choose a value'}
        />
    );
};

export default SelectFromValuesLookup;
