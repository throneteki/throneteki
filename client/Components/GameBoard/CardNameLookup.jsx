import React from 'react';
import PropTypes from 'prop-types';

import TypeaheadLookup from './TypeaheadLookup';

function CardNameLookup(props) {
    let cardNames = [...new Set(Object.values(props.cards).map((card) => card.name))];

    return <TypeaheadLookup values={cardNames} onValueSelected={props.onValueSelected} />;
}

CardNameLookup.displayName = 'CardNameLookup';
CardNameLookup.propTypes = {
    cards: PropTypes.object,
    onValueSelected: PropTypes.object
};

export default CardNameLookup;
