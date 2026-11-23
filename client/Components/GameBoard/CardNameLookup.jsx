import React from 'react';

import TypeaheadLookup from './TypeaheadLookup';

const CardNameLookup = ({ cards, onValueSelected, compact }) => {
    let cardNames = [...new Set(Object.values(cards).map((card) => card.name))];

    return (
        <TypeaheadLookup
            values={cardNames}
            onValueSelected={onValueSelected}
            compact={compact}
            width='12rem'
            placeholder='Type a card name'
        />
    );
};

export default CardNameLookup;
