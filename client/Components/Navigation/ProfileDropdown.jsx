import React from 'react';
import { Avatar, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem, Link } from '@heroui/react';
import NavigationLink from '../Site/NavigationLink';
import { useSelector } from 'react-redux';

const ProfileDropdown = ({ user, menu }) => {
    const { path } = useSelector((state) => state.navigation);

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
            <DropdownMenu
                variant='flat'
                className='font-[PoppinsMedium] text-secondary'
                disabledKeys={menu.filter((mi) => mi.path === path).map((mi) => mi.title)}
            >
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
