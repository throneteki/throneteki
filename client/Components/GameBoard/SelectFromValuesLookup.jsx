import React from 'react';
import PropTypes from 'prop-types';

import TypeaheadLookup from './TypeaheadLookup';

function SelectFromValuesLookup(props) {
    return (
        <TypeaheadLookup values={props.selectableValues} onValueSelected={props.onValueSelected} />
    );
}

SelectFromValuesLookup.displayName = 'SelectFromValuesLookup';
SelectFromValuesLookup.propTypes = {
    onValueSelected: PropTypes.func,
    selectableValues: PropTypes.array
};

export default SelectFromValuesLookup;
