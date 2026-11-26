import React from 'react';
import SquishableCardPanel from '../SquishableCardPanel';

// A player's shadows, always beside their hand. Empty, it is shown only while a card could be dropped in.
const ShadowsZone = ({ cards, onCardClick, droppable }) => (
    <div className='flex items-stretch'>
        {droppable(
            'shadows',
            <SquishableCardPanel
                cards={cards}
                maxCards={Math.max(1, Math.min(cards.length, 1.5))}
                onCardClick={onCardClick}
                source='shadows'
                title='Shadows'
            />
        )}
    </div>
);

export default ShadowsZone;
