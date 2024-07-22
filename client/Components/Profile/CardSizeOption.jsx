import React, { useCallback } from 'react';
import classNames from 'classnames';

const CardSizeOption = ({ name, label, selected, onSelect }) => {
    const handleClick = useCallback(() => {
        if (onSelect) {
            onSelect(name);
        }
    }, [name, onSelect]);

    return (
        <div key={name} className='card-settings' onClick={handleClick}>
            <div className={classNames('card', 'vertical', name, { selected: selected })}>
                <img
                    className={classNames('card', 'vertical', name)}
                    src='img/cards/cardback.png'
                />
            </div>
            <span className='bg-label'>{label}</span>
        </div>
    );
};

export default CardSizeOption;
