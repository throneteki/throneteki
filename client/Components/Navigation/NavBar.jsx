import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import Link from '../Site/Link';
import Avatar from '../Site/Avatar';
import menus from '../../menus';
import ContextMenu from './ContextMenu';
import ServerStatus from './ServerStatus';

import SmallHeaderIcon from '../../assets/img/header_icon.png';
import HeaderIcon from '../../assets/img/main_header_logo.png';

const NavBar = ({ title }) => {
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

    const renderMenuItem = useCallback(
        (menuItem) => {
            let active = menuItem.path === path ? 'active' : '';

            if (menuItem.showOnlyWhenLoggedOut && user) {
                return null;
            }

            if (menuItem.showOnlyWhenLoggedIn && !user) {
                return null;
            }

            if (menuItem.permission && (!user || !user.permissions[menuItem.permission])) {
                return null;
            }

            if (menuItem.childItems) {
                let className = 'dropdown';

                if (
                    menuItem.childItems.some((item) => {
                        return item.path === path;
                    })
                ) {
                    className += ' active';
                }

                var childItems = menuItem.childItems.reduce((items, item) => {
                    if (item.permission && (!user || !user.permissions[item.permission])) {
                        return items;
                    }

                    return items.concat(
                        <li key={item.title}>
                            <Link href={item.path}>{item.title}</Link>
                        </li>
                    );
                }, []);

                if (childItems.length === 0) {
                    return null;
                }

                return (
                    <li key={menuItem.title} className={className}>
                        <a
                            href='#'
                            className='dropdown-toggle'
                            data-toggle='dropdown'
                            role='button'
                            aria-haspopup='true'
                            aria-expanded='false'
                        >
                            {menuItem.showProfilePicture && user ? (
                                <Avatar username={user.username} />
                            ) : null}
                            {menuItem.showProfilePicture && user ? user.username : menuItem.title}
                            <span className='caret' />
                        </a>
                        <ul className='dropdown-menu'>{childItems}</ul>
                    </li>
                );
            }

            return (
                <li key={menuItem.title} className={active}>
                    <Link href={menuItem.path}>{menuItem.title}</Link>
                </li>
            );
        },
        [path, user]
    );

    let leftMenu = useMemo(() => {
        return menus.filter((menu) => {
            return menu.position === 'left';
        });
    }, []);
    let rightMenu = useMemo(() => {
        return menus.filter((menu) => {
            return menu.position === 'right';
        });
    }, []);

    let leftMenuToRender = leftMenu.map(renderMenuItem);
    let rightMenuToRender = rightMenu.map(renderMenuItem);

    let numGames = games ? (
        <li>
            <span>{`${games.length} Games`}</span>
        </li>
    ) : null;

    return (
        <nav className='navbar navbar-inverse navbar-fixed-top navbar-sm'>
            <div className='small-navbar-wrapper hidden-md hidden-lg'>
                <div className='small-navbar-spacer'></div>
                <Link href='/' className='navbar-brand'>
                    <img
                        src={SmallHeaderIcon}
                        height='32'
                        className='d-inline-block align-top'
                        alt='The Iron Throne Logo'
                    />
                </Link>
                <div className='small-navbar-right'>
                    <button
                        className='navbar-toggle collapsed'
                        type='button'
                        data-toggle='collapse'
                        data-target='#navbar'
                        aria-expanded='false'
                        aria-controls='navbar'
                    >
                        <span className='sr-only'>Toggle Navigation</span>
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                        <span className='icon-bar' />
                    </button>
                </div>
            </div>
            <div id='navbar' className='collapse-menu collapse navbar-collapse'>
                <ul className='nav navbar-nav left-menu'>{leftMenuToRender}</ul>
                <Link href='/' className='navbar-brand visible-md-block visible-lg-block'>
                    <img
                        src={currentGame?.started ? SmallHeaderIcon : HeaderIcon}
                        height='32'
                        className='d-inline-block align-top'
                        alt='The Iron Throne Logo'
                    />
                </Link>
                <ul className='nav navbar-right navbar-nav'>
                    <ContextMenu />
                    {numGames}
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
                    {rightMenuToRender}
                </ul>
            </div>
        </nav>
    );
};

export default NavBar;
