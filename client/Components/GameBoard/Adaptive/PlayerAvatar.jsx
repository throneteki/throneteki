import React from 'react';
import UserAvatar from '../../Site/UserAvatar';

// A player's avatar as the rest of the site draws it: their picture, or the site's fallback while there is none
const PlayerAvatar = ({ name, className, style }) => (
    <UserAvatar username={name} className={className} style={style} />
);

export default PlayerAvatar;
