import React from 'react';
import classNames from 'classnames';

import { deckStatusLabel } from './DeckHelper';

const DeckStatusLabel = ({ className, status }) => {
    const text = status ? deckStatusLabel(status) : 'Loading...';
    const restrictionsFollowed = status.faqJoustRules && status.noUnreleasedCards;
    let fullClassName = classNames(className, 'label', {
        'label-danger': !status.basicRules || !status.noBannedCards,
        'label-warning': status.basicRules && status.noBannedCards && !restrictionsFollowed,
        'label-success': status.basicRules && status.noBannedCards && restrictionsFollowed
    });
    return <span className={fullClassName}>{text}</span>;
};

export default DeckStatusLabel;
