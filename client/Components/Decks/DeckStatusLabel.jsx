import React from 'react';
import { Chip } from '@heroui/react';
import { deckStatusLabel } from './DeckHelper';
import classNames from 'classnames';

const DeckStatusLabel = ({ className = 'h-10', status }) => {
    const text = status ? deckStatusLabel(status) : 'Loading...';
    const restrictionsFollowed = status.faqJoustRules && status.noUnreleasedCards;

    let bg = 'default';

    if (!status.basicRules || !status.noBannedCards) {
        bg = 'danger';
    } else if (status.basicRules && status.noBannedCards && !restrictionsFollowed) {
        bg = 'warning';
    } else if (status.basicRules && status.noBannedCards && restrictionsFollowed) {
        bg = 'success';
    }
    const chipClass = classNames('select-none', className);
    return (
        <Chip className={chipClass} color={bg} radius='md'>
            {text}
        </Chip>
    );
};

export default DeckStatusLabel;
