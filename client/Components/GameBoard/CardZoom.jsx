import React from 'react';
import classNames from 'classnames';

import AltCard from './AltCard';

const CardZoom = ({ card, cardName, imageUrl, orientation, show }) => {
    const zoomClass = classNames('right-1 top-1 absolute z-50 pointer-events-none', {
        'w-[calc(var(--throneteki-card-width)*4)]': orientation === 'vertical',
        'w-[calc(var(--throneteki-card-height)*4)]': orientation !== 'vertical'
    });

    return (
        <div className={zoomClass}>
            {show ? (
                <div className='w-full h-full shadow'>
                    <span className='block text-sm font-[Lucida Sans] uppercase text-center whitespace-nowrap overflow-hidden'>
                        {cardName}
                    </span>
                    <img
                        className='absolute top-0 right-0 rounded-xl z-50 img-responsive'
                        src={imageUrl}
                    />
                    {card && <AltCard card={card} />}
                </div>
            ) : null}
        </div>
    );
};

export default CardZoom;
