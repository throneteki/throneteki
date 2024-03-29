import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import {deckStatusLabel} from './DeckHelper';

export default function DeckStatusLabel({className, status}) {
    const text = status ? deckStatusLabel(status) : 'Loading...';
    const restrictionsFollowed = status.faqJoustRules && status.noUnreleasedCards;
    let fullClassName = classNames(className, 'label', {
        'label-danger': !status.basicRules || !status.noBannedCards,
        'label-warning': status.basicRules && status.noBannedCards && !restrictionsFollowed,
        'label-success': status.basicRules && status.noBannedCards && restrictionsFollowed
    });
    return <span className={ fullClassName }>{ text }</span>;
}

DeckStatusLabel.propTypes = {
    className: PropTypes.string,
    status: PropTypes.object
};
