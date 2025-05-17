import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

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
    Link,
    Navbar,
    NavbarBrand,
    NavbarContent,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle
} from '@heroui/react';
import { LeftMenu, ProfileMenu, RightMenu } from '../../menus';
import ProfileDropdown from './ProfileDropdown';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import NavigationLink from '../Site/NavigationLink';
import ConfirmDialog from '../Site/ConfirmDialog';
import { sendLeaveGameMessage } from '../../redux/reducers/game';
import FullScreenButton from './FullScreenButton';

const NavBar = () => {
    const dispatch = useDispatch();
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

    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [showConfirmLeave, setShowConfirmLeave] = useState(false);
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
                                <Link
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
                                </Link>
                            </DropdownTrigger>
                            <DropdownMenu
                                id={`nav-${menuItem.title}`}
                                variant='flat'
                                className='font-[PoppinsMedium] text-secondary'
                                title={menuItem.title}
                            >
                                {children.map((childItem, index) =>
                                    childItem.path ? (
                                        <DropdownItem
                                            key={index}
                                            classNames={{ base: 'flex' }}
                                            onPointerDown={() => setIsMenuOpen(false)}
                                        >
                                            <Link
                                                className='w-full'
                                                as={NavigationLink}
                                                href={childItem.path}
                                            >
                                                {childItem.title}
                                            </Link>
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
                    <NavbarMenuItem key={index} onPointerDown={() => setIsMenuOpen(false)}>
                        <Link
                            className='w-full font-[PoppinsMedium] text-secondary transition-colors duration-500 ease-in-out hover:text-white'
                            size='lg'
                            as={NavigationLink}
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
        <>
            <Navbar
                isBordered
                height='3rem'
                maxWidth='full'
                isMenuOpen={isMenuOpen}
                className='z-0'
            >
                <NavbarContent className='lg:hidden' justify='start'>
                    <NavbarMenuToggle onChange={(isOpen) => setIsMenuOpen(isOpen)} />
                </NavbarContent>
                <NavbarContent className='lg:hidden' justify='center'>
                    <NavbarBrand as={NavigationLink} href='/'>
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
                    <FullScreenButton />
                    <ProfileDropdown menu={ProfileMenu} user={user} />
                </NavbarContent>

                <NavbarMenu>
                    {leftMenu}
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
                    <ContextMenu
                        onPress={(showConfirmLeave) => {
                            setIsMenuOpen(false);
                            setShowConfirmLeave(showConfirmLeave);
                        }}
                    />
                </NavbarMenu>

                <NavbarContent className='hidden lg:flex' justify='start'>
                    {leftMenu}
                </NavbarContent>
                <NavbarContent className='hidden lg:flex' justify='center'>
                    <NavbarBrand as={NavigationLink} href='/'>
                        <Image
                            src={currentGame?.started ? SmallHeaderIcon : HeaderIcon}
                            style={{ height: '48px' }}
                            alt='The Iron Throne Logo'
                        />
                    </NavbarBrand>
                </NavbarContent>
                <NavbarContent className='hidden lg:flex' justify='end'>
                    <ContextMenu
                        onPress={(showConfirmLeave) => {
                            setIsMenuOpen(false);
                            setShowConfirmLeave(showConfirmLeave);
                        }}
                    />
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
            <ConfirmDialog
                isOpen={showConfirmLeave}
                message='Your game is not finished, are you sure you want to leave?'
                onOpenChange={setShowConfirmLeave}
                onCancel={() => setShowConfirmLeave(false)}
                onOk={async () => {
                    dispatch(sendLeaveGameMessage());
                }}
            />
        </>
    );
};

export default NavBar;
