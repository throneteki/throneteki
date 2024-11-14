import React from 'react';

import TypeaheadLookup from './TypeaheadLookup';

const CardNameLookup = ({ cards, onValueSelected }) => {
    let cardNames = [...new Set(Object.values(cards).map((card) => card.name))];

    return <TypeaheadLookup values={cardNames} onValueSelected={onValueSelected} />;
};

export default CardNameLookup;
