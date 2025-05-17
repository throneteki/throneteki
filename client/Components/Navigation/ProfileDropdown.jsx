import React from 'react';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Link } from '@heroui/react';
import NavigationLink from '../Site/NavigationLink';

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
            <DropdownMenu variant='flat' className='font-[PoppinsMedium] text-secondary'>
                {menu.map((mi) => (
                    <DropdownItem key={mi.title}>
                        <Link className='w-full' href={mi.path} as={NavigationLink}>
                            {mi.title}
                        </Link>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default ProfileDropdown;
