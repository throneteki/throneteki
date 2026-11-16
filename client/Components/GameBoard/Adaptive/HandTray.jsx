import React, { useEffect, useRef, useState } from 'react';
import classNames from 'classnames';
import SquishableCardPanel from '../SquishableCardPanel';
import { withoutPendingAttachment } from '../pendingAttachment';

const peekShare = 0.4;
const peekHeight = `calc(var(--card-scale, 1) * 5.6rem * ${peekShare})`;

// Our hand along the bottom of the board, as wide as the board. Peeking, only the top of each card shows: a tap
// raises the whole hand over the board (a hold still picks a card up), and a tap anywhere else lowers it.
const HandTray = ({ player, onCardClick, droppable, peek = false }) => {
    const ref = useRef(null);
    const [raised, setRaised] = useState(false);
    const lifted = peek && raised;

    useEffect(() => {
        if (!lifted) {
            return;
        }
        const lower = (event) => {
            if (!ref.current?.contains(event.target)) {
                setRaised(false);
            }
        };
        document.addEventListener('pointerdown', lower, true);
        return () => document.removeEventListener('pointerdown', lower, true);
    }, [lifted]);

    const onClickCapture = (event) => {
        if (peek && !raised) {
            event.stopPropagation();
            event.preventDefault();
            setRaised(true);
        }
    };

    return (
        <div
            ref={ref}
            data-hand-tray=''
            className='relative w-full'
            style={peek ? { height: peekHeight } : undefined}
            onClickCapture={onClickCapture}
        >
            <div
                className={classNames('w-full', {
                    'absolute left-0 top-0 z-[260] transition-[translate] duration-150 ease-out':
                        peek
                })}
                style={lifted ? { translate: `0 calc(-${1 - peekShare} * 100%)` } : undefined}
            >
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
        </div>
    );
};

export default HandTray;
