import React, { useCallback } from 'react';
import classNames from 'classnames';

const CardSizeOption = ({ name, label, selected, onSelect }) => {
    const handleClick = useCallback(() => {
        if (onSelect) {
            onSelect(name);
        }
    }, [name, onSelect]);

    return (
        <div key={name} className='inline-block' onPointerDown={handleClick}>
            <div className={classNames('card', 'vertical', name)}>
                <img
                    className={classNames('card', 'vertical', name, {
                        'border-2 border-green-600': selected
                    })}
                    src='img/cards/cardback.png'
                />
            </div>
            <span className='inline-block w-full text-center'>{label}</span>
        </div>
    );
};

export default CardSizeOption;
