import React from 'react';
import SquishableCardPanel from '../SquishableCardPanel';
import { withoutPendingAttachment } from '../pendingAttachment';
import Reveal from './Reveal';
import ShadowsZone from './ShadowsZone';

// Our hand below our board in portrait, scrolling with it, from its start and no wider than the view: no more than
// five cards wide before the cards overlap. Shadows sit beside it while there are cards in them, or empty when offered (manual mode, or
// while a card is carried).
const HandTray = ({ player, onCardClick, droppable, offerEmpty = false }) => {
    const shadows = withoutPendingAttachment(player.cardPiles.shadows);
    return (
        <div data-hand-tray='' className='flex w-full items-end justify-start gap-2'>
            <div className='min-w-0 max-w-[var(--scroll-view-width,100%)] flex-1'>
                {droppable(
                    'hand',
                    <SquishableCardPanel
                        cards={withoutPendingAttachment(player.cardPiles.hand)}
                        groupVisibleCards
                        fitWidth
                        maxCards={5}
                        onCardClick={onCardClick}
                        source='hand'
                        title='Hand'
                        flipFrom={player.user?.username}
                        stagedArrivals
                        redeal={player.phase === 'setup'}
                    />,
                    undefined,
                    'w-full'
                )}
            </div>
            <Reveal show={shadows.length > 0 || offerEmpty} className='shrink-0 self-stretch'>
                <ShadowsZone cards={shadows} onCardClick={onCardClick} droppable={droppable} />
            </Reveal>
        </div>
    );
};

export default HandTray;
