import React, { useCallback, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';

import ContextMenu from './ContextMenu';
import ServerStatus from './ServerStatus';
import SmallHeaderIcon from '../../assets/img/header_icon.png';
import HeaderIcon from '../../assets/img/main_header_logo.png';
import { LeftMenu, ProfileMenu, RightMenu } from '../../menus';
import ProfileDropdown from './ProfileDropdown';
import NavigationLink from '../Site/NavigationLink';
import ConfirmDialog from '../Site/ConfirmDialog';
import { sendLeaveGameMessage } from '../../redux/reducers/game';
import FullScreenButton from './FullScreenButton';
import NavItem from './NavItem';
import NavDropdown from './NavDropdown';

const NavBar = () => {
    const dispatch = useDispatch();
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

    const filterMenuItems = useCallback(
        (menuItems) =>
            menuItems.filter(
                (menuItem) =>
                    !(user && menuItem.showOnlyWhenLoggedOut) &&
                    !(!user && menuItem.showOnlyWhenLoggedIn) &&
                    (!menuItem.permission || user?.permissions?.[menuItem.permission])
            ),
        [user]
    );

    const renderMenuItems = (menuItems) =>
        filterMenuItems(menuItems).map((menuItem, index) => {
            const children = menuItem.childItems && filterMenuItems(menuItem.childItems);

            if (children && children.length > 0) {
                return (
                    <NavDropdown
                        key={menuItem.title || index}
                        title={menuItem.title}
                        items={children.filter((child) => child.path)}
                        onNavigate={() => setIsMenuOpen(false)}
                    />
                );
            }

            if (!menuItem.path) {
                return null;
            }

            return (
                <span key={menuItem.path} onPointerDown={() => setIsMenuOpen(false)}>
                    <NavItem path={menuItem.path}>{menuItem.title}</NavItem>
                </span>
            );
        });

    const numGames = games ? (
        <span className='font-medium text-nowrap text-white'>{`${games.length} Games`}</span>
    ) : null;

    const serverStatus = currentGame?.started ? (
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
    );

    const contextMenu = (
        <ContextMenu
            onPress={(confirmLeave) => {
                setIsMenuOpen(false);
                setShowConfirmLeave(confirmLeave);
            }}
        />
    );

    return (
        <>
            <header className='relative z-20 h-12 border-b border-white/10 bg-black'>
                <div className='flex h-full items-center gap-4 px-4 lg:hidden'>
                    <button
                        type='button'
                        aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
                        aria-expanded={isMenuOpen}
                        className='text-xl text-ink'
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        <FontAwesomeIcon icon={isMenuOpen ? faXmark : faBars} />
                    </button>
                    <NavigationLink href='/' className='mx-auto'>
                        <img
                            src={SmallHeaderIcon}
                            width='32'
                            height='32'
                            className='inline-block align-top'
                            alt='The Iron Throne'
                        />
                    </NavigationLink>
                    <div className='flex items-center gap-3'>
                        {renderMenuItems(RightMenu)}
                        <FullScreenButton />
                        <ProfileDropdown menu={ProfileMenu} user={user} />
                    </div>
                </div>

                <div className='hidden h-full items-center px-6 lg:grid lg:grid-cols-[1fr_auto_1fr]'>
                    <nav aria-label='Main' className='flex items-center gap-4'>
                        {renderMenuItems(LeftMenu)}
                    </nav>
                    <NavigationLink href='/'>
                        <img
                            src={currentGame?.started ? SmallHeaderIcon : HeaderIcon}
                            className='h-12'
                            alt='The Iron Throne'
                        />
                    </NavigationLink>
                    <div className='flex items-center justify-end gap-4'>
                        {contextMenu}
                        {!currentGame?.started && numGames}
                        {serverStatus}
                        {renderMenuItems(RightMenu)}
                        <ProfileDropdown menu={ProfileMenu} user={user} />
                    </div>
                </div>

                {isMenuOpen && (
                    <nav
                        aria-label='Main'
                        className='absolute inset-x-0 top-12 flex flex-col gap-4 border-b border-gold-line bg-black/95 px-6 py-5 text-lg lg:hidden'
                    >
                        {renderMenuItems(LeftMenu)}
                        {!currentGame?.started && numGames}
                        {serverStatus}
                        {contextMenu}
                    </nav>
                )}
            </header>
            <ConfirmDialog
                isOpen={showConfirmLeave}
                message='Your game is not finished, and you will automatically concede when leaving. Are you sure you want to leave?'
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
