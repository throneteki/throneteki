import React from 'react';
import { Chip } from '@nextui-org/react';
import { deckStatusLabel } from './DeckHelper';

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

    return (
        <Chip className={className} color={bg} radius='md'>
            {text}
        </Chip>
    );
};

export default DeckStatusLabel;
