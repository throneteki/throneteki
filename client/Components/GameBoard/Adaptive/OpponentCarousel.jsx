import React from 'react';
import classNames from 'classnames';

// The opponents' side of the board: one slide per opponent, swiped between. With one opponent (joust) it is a
// single slide that never moves.
const OpponentCarousel = ({ opponents, renderSide, className }) => {
    const single = opponents.length < 2;
    return (
        <div
            data-opponent-carousel=''
            className={classNames(
                'flex min-h-0 min-w-0',
                single
                    ? 'overflow-hidden'
                    : 'overflow-x-auto snap-x snap-mandatory [scrollbar-width:none]',
                className
            )}
        >
            {opponents.map((opponent) => (
                <div
                    key={opponent.name ?? opponent.seatNo}
                    data-opponent-slide={opponent.name}
                    className='flex h-full w-full min-w-0 shrink-0 snap-start'
                >
                    {renderSide(opponent)}
                </div>
            ))}
        </div>
    );
};

export default OpponentCarousel;
