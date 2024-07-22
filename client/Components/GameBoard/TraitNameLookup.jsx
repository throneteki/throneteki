import React from 'react';

import TypeaheadLookup from './TypeaheadLookup';

const TraitNameLookup = (props) => {
    let cards = Object.values(props.cards);
    let allTraits = cards.reduce((traits, card) => traits.concat(card.traits || []), []);
    let uniqueTraits = [...new Set(allTraits)];

    uniqueTraits.sort();

    return <TypeaheadLookup values={uniqueTraits} onValueSelected={props.onValueSelected} />;
};

export default TraitNameLookup;
