import React from 'react';
import classNames from 'classnames';
import { Image } from "@heroui/react";

import { Constants } from '../../constants';
import './FactionImage.css';

const FactionImage = ({
    className,
    faction,
    onMouseMove,
    onMouseOut,
    onMouseOver,
    size = 'sm'
}) => {
    const classString = classNames(className, size);
    return (
        <div
            className='faction-image'
            onMouseMove={onMouseMove}
            onMouseOut={onMouseOut}
            onMouseOver={onMouseOver}
        >
            <Image
                className={classString}
                src={Constants.FactionsImagePaths[faction]}
                radius='sm'
            />
        </div>
    );
};

export default FactionImage;
