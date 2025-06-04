import React from 'react';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@heroui/react';
import NavItem from './NavItem';

const ProfileDropdown = ({ user, menu }) => {
    if (!user) {
        return null;
    }

    return (
        <Dropdown>
            <DropdownTrigger>
                <Avatar
                    isBordered
                    as='button'
                    className='transition-transform'
                    name={user.name}
                    size='sm'
                    src={`/img/avatar/${user.username}.png`}
                />
            </DropdownTrigger>
            <DropdownMenu variant='flat'>
                {menu.map((mi) => (
                    <DropdownItem key={mi.title}>
                        <NavItem className='w-full' size='md' path={mi.path}>
                            {mi.title}
                        </NavItem>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default ProfileDropdown;
