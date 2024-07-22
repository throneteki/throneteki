import React from 'react';
import classNames from 'classnames';

import AltCard from './AltCard';

const CardZoom = ({ card, cardName, imageUrl, orientation, show }) => {
    const zoomClass = classNames('card-large', {
        vertical: orientation === 'vertical',
        horizontal: orientation === 'horizontal'
    });

    return (
        <div className={zoomClass}>
            {show ? (
                <div className='card-zoomed shadow'>
                    <span className='card-name'>{cardName}</span>
                    <img className='image-large img-responsive' src={imageUrl} />
                    {card && <AltCard card={card} />}
                </div>
            ) : null}
        </div>
    );
};

export default CardZoom;
