import React, { useCallback, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

import Link from '../Site/Link';
import ContextMenu from './ContextMenu';
import ServerStatus from './ServerStatus';

import SmallHeaderIcon from '../../assets/img/header_icon.png';
import HeaderIcon from '../../assets/img/main_header_logo.png';
import {
    Dropdown,
    DropdownItem,
    DropdownMenu,
    DropdownTrigger,
    Image,
    Link as NextUiLink,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from '@nextui-org/react';
import { LeftMenu, ProfileMenu, RightMenu } from '../../menus';
import ProfileDropdown from './ProfileDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';

const NavBar = () => {
    const { path } = useSelector((state) => state.navigation);
    const { user } = useSelector((state) => state.auth);
    const {
        connected: lobbySocketConnected,
        connecting: lobbySocketConnecting,
        currentGame,
        games,
        responseTime: lobbyResponse
    } = useSelector((state) => state.lobby);
    const {
        connected: gameConnected,
        connecting: gameConnecting,
        responseTime: gameResponse
    } = useSelector((state) => state.game);

    const [dropdownOpenStatus, setDropdownOpenStatus] = useState({});

    const userCanSeeMenu = (menuItem, user) => {
        return !menuItem.permission || user.permissions[menuItem.permission];
    };

    const filterMenuItems = useCallback((menuItems, user) => {
        const returnedItems = [];

        for (const menuItem of menuItems) {
            if (user && menuItem.showOnlyWhenLoggedOut) {
                continue;
            }

            if (!user && menuItem.showOnlyWhenLoggedIn) {
                continue;
            }

            if (!userCanSeeMenu(menuItem, user)) {
                continue;
            }

            returnedItems.push(menuItem);
        }

        return returnedItems;
    }, []);

    const renderMenuItems = useCallback(
        (menuItems) => {
            return filterMenuItems(menuItems, user).map((menuItem, index) => {
                const children = menuItem.childItems && filterMenuItems(menuItem.childItems, user);

                if (children && children.length > 0) {
                    return (
                        <Dropdown
                            key={menuItem.title || index}
                            onOpenChange={(isOpen) => {
                                const newDropDownStatus = Object.assign({}, dropdownOpenStatus);
                                newDropDownStatus[menuItem.title || index] = isOpen;

                                setDropdownOpenStatus(newDropDownStatus);
                            }}
                        >
                            <DropdownTrigger>
                                <NextUiLink
                                    className='flex gap-1 cursor-pointer font-[PoppinsMedium] text-secondary transition-colors duration-500 ease-in-out hover:text-white'
                                    size='lg'
                                >
                                    {menuItem.title}
                                    <FontAwesomeIcon
                                        icon={
                                            dropdownOpenStatus[menuItem.title || index]
                                                ? faChevronUp
                                                : faChevronDown
                                        }
                                    />
                                </NextUiLink>
                            </DropdownTrigger>
                            <DropdownMenu
                                id={`nav-${menuItem.title}`}
                                variant='flat'
                                className='font-[PoppinsMedium] text-secondary'
                                title={menuItem.title}
                            >
                                {children.map((childItem, index) =>
                                    childItem.path ? (
                                        <DropdownItem key={index} classNames={{ base: 'flex' }}>
                                            <span className='flex'>
                                                <Link className='w-full' href={childItem.path}>
                                                    {childItem.title}
                                                </Link>
                                            </span>
                                        </DropdownItem>
                                    ) : null
                                )}
                            </DropdownMenu>
                        </Dropdown>
                    );
                }

                if (!menuItem.path) {
                    return <React.Fragment key={index}></React.Fragment>;
                }

                return (
                    <NavbarMenuItem key={index}>
                        <Link
                            className='w-full font-[PoppinsMedium] text-secondary transition-colors duration-500 ease-in-out hover:text-white'
                            size='lg'
                            as={Link}
                            href={menuItem.path}
                        >
                            {menuItem.title}
                        </Link>
                    </NavbarMenuItem>
                );
            });
        },
        [dropdownOpenStatus, filterMenuItems, user]
    );

    let leftMenu = useMemo(() => {
        return renderMenuItems(LeftMenu);
    }, [renderMenuItems]);

    let rightMenu = useMemo(() => {
        return renderMenuItems(RightMenu);
    }, [renderMenuItems]);

    let numGames = games ? (
        <li className='font-[PoppinsMedium] text-white text-nowrap'>
            <span>{`${games.length} Games`}</span>
        </li>
    ) : null;

    return (
        <Navbar isBordered height='3rem' maxWidth='full'>
            <NavbarContent className='lg:hidden' justify='start'>
                <NavbarMenuToggle />
            </NavbarContent>
            <NavbarContent className='pr-3 lg:hidden' justify='center'>
                <NavbarBrand as={Link} href='/'>
                    <img
                        src={SmallHeaderIcon}
                        width='32'
                        height='32'
                        className='inline-block align-top'
                        alt='The Iron Throne Logo'
                    />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className='lg:hidden' justify='end'>
                {rightMenu}
            </NavbarContent>

            <NavbarMenu>{leftMenu}</NavbarMenu>

            <NavbarContent className='hidden lg:flex' justify='start'>
                {leftMenu}
            </NavbarContent>
            <NavbarContent className='hidden lg:flex' justify='center'>
                <NavbarBrand as={Link} href='/'>
                    <Image
                        src={currentGame?.started ? SmallHeaderIcon : HeaderIcon}
                        style={{ height: '48px' }}
                        alt='The Iron Throne Logo'
                    />
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className='hidden lg:flex' justify='end'>
                <ContextMenu />
                {!currentGame?.started && numGames}
                {currentGame?.started ? (
                    <ServerStatus
                        connected={gameConnected}
                        connecting={gameConnecting}
                        serverType='Game server'
                        responseTime={gameResponse}
                    />
                ) : (
                    <ServerStatus
                        connected={lobbySocketConnected}
                        connecting={lobbySocketConnecting}
                        serverType='Lobby'
                        responseTime={lobbyResponse}
                    />
                )}
                {rightMenu}
                <ProfileDropdown menu={ProfileMenu} user={user} />
            </NavbarContent>
        </Navbar>
    );
};

export default NavBar;
