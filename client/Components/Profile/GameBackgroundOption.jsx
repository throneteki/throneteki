import React, { useCallback } from 'react';
import classNames from 'classnames';

const GameBackgroundOption = ({ name, label, imageUrl, selected, onSelect }) => {
    const handleClick = useCallback(() => {
        if (onSelect) {
            onSelect(name);
        }
    }, [name, onSelect]);

    return (
        <div onClick={handleClick}>
            <img
                className={classNames('img-responsive', { 'border-2 border-green-600': selected })}
                src={imageUrl}
            />
            <span className='inline-block w-full text-center'>{label}</span>
        </div>
    );
};

export default GameBackgroundOption;
