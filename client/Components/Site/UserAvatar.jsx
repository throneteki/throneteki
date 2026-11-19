import React from 'react';
import { Avatar } from '@heroui/react';

const UserAvatar = ({ username, version, size, className }) => {
    const src = username
        ? `/img/avatar/${username}.png${version !== undefined ? `?v=${version}` : ''}`
        : undefined;

    return (
        <Avatar size={size} className={className}>
            {src && <Avatar.Image src={src} alt='' />}
            <Avatar.Fallback>{(username || '?').charAt(0).toUpperCase()}</Avatar.Fallback>
        </Avatar>
    );
};

export default UserAvatar;
