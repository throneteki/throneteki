import React from 'react';

import TypeaheadLookup from './TypeaheadLookup';

const SelectFromValuesLookup = (props) => {
    return (
        <TypeaheadLookup values={props.selectableValues} onValueSelected={props.onValueSelected} />
    );
};

export default SelectFromValuesLookup;
