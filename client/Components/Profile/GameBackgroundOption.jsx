import React, { useCallback } from 'react';
import classNames from 'classnames';

const GameBackgroundOption = ({ name, label, imageUrl, selected, onSelect }) => {
    const handleClick = useCallback(() => {
        if (onSelect) {
            onSelect(name);
        }
    }, [name, onSelect]);

    return (
        <div className='col-sm-4' onClick={handleClick}>
            <img className={classNames('img-responsive', { selected: selected })} src={imageUrl} />
            <span className='bg-label'>{label}</span>
        </div>
    );
};

export default GameBackgroundOption;
