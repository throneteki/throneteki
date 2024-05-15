import React from 'react';
import PropTypes from 'prop-types';

function CardLink({ card, onClick, onMouseOut, onMouseOver }) {
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
}

CardLink.propTypes = {
    card: PropTypes.object,
    onClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func
};

export default CardLink;
