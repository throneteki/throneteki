import React from 'react';

const CardLink = ({ card, onClick, onMouseOut, onMouseOver }) => {
    return (
        <span
            className='card-link'
            onClick={() => onClick && onClick(card)}
            onMouseOver={() => onMouseOver && onMouseOver(card)}
            onMouseOut={() => onMouseOut && onMouseOut(card)}
        >
            {card.label}
        </span>
    );
};

export default CardLink;
