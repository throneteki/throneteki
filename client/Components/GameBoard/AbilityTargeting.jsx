import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import CardHoverable from '../Images/CardHoverable';
import CardImage from '../Images/CardImage';

const AbilityTargeting = ({ targets, source }) => {
    const targetCardsRef = React.useRef(null);

    const renderSimpleCard = (card, index) => (
        <CardHoverable
            key={index || card.code}
            code={card.code}
            className='relative w-full min-w-0'
        >
            <CardImage
                code={card.code || (card.shadowPosition ? 'cardback_shadow' : 'cardback')}
                size='normal'
            />
            {card.shadowPosition ? (
                <div className='absolute bottom-0 right-0 pr-2 text-large'>
                    {'#' + card.shadowPosition}
                </div>
            ) : null}
        </CardHoverable>
    );

    const targetCards = targets.map((target, index) => renderSimpleCard(target, index));

    return (
        <div className='flex items-center justify-center content-between pb-2 px-2 gap-1 w-full'>
            <div>{renderSimpleCard(source)}</div>
            <FontAwesomeIcon icon={faArrowRight} />
            <div ref={targetCardsRef} className='grid grid-flow-col gap-1'>
                {targetCards}
            </div>
        </div>
    );
};

export default AbilityTargeting;
