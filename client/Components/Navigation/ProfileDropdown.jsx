import React from 'react';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import Link from '../Site/Link';

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
                        <span className='flex'>
                            <Link className='w-full' href={mi.path}>
                                {mi.title}
                            </Link>
                        </span>
                    </DropdownItem>
                ))}
            </DropdownMenu>
        </Dropdown>
    );
};

export default ProfileDropdown;
