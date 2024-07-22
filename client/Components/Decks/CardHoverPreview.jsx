import React from 'react';
import classNames from 'classnames';

import AltCard from '../GameBoard/AltCard';

const CardHoverPreview = ({ card }) => {
    return (
        <div className={classNames('hover-card', { horizontal: card.type === 'plot' })}>
            <img className='hover-image' src={'/img/cards/' + card.code + '.png'} />
            <AltCard card={card} />
        </div>
    );
};

export default CardHoverPreview;
