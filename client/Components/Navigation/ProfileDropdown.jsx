import React from 'react';
import { useSelector } from 'react-redux';
import NavDropdown from './NavDropdown';
import UserAvatar from '../Site/UserAvatar';

const ProfileDropdown = ({ user, menu }) => {
    const avatarVersion = useSelector((state) => state.auth.avatarVersion);

    if (!user) {
        return null;
    }

    return (
        <NavDropdown
            items={menu}
            triggerLabel='Profile menu'
            trigger={
                <UserAvatar
                    username={user.username}
                    version={avatarVersion}
                    size='sm'
                    className='ring-2 ring-edge transition-transform'
                />
            }
        />
    );
};

export default ProfileDropdown;
