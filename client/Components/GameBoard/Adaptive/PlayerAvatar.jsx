import React from 'react';
import { Avatar } from '@heroui/react';

// A player's avatar as the rest of the site draws it: their picture, or the site's fallback while there is none
const PlayerAvatar = ({ name, className, style }) => (
    <Avatar
        src={name ? `/img/avatar/${name}.png` : undefined}
        showFallback
        className={className}
        style={style}
    />
);

export default PlayerAvatar;
