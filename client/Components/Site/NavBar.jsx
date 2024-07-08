import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

import Link from './Link';
import Avatar from './Avatar';
import menus from '../../menus';
import ContextMenu from './ContextMenu';

const NavBar = ({ title }) => {
    const { path } = useSelector((state) => state.navigation);
    const { user } = useSelector((state) => state.auth);
    const {
        connected: lobbySocketConnected,
        connecting: lobbySocketConnecting,
        currentGame,
        games
    } = useSelector((state) => state.lobby);
    const { connected: gameConnected, connecting: gameConnecting } = useSelector(
        (state) => state.game
    );

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

    let className = 'glyphicon glyphicon-signal';
    let toolTip = 'Lobby is';

    if (lobbySocketConnected) {
        className += ' text-success';
        toolTip += ' connected';
    } else if (lobbySocketConnecting) {
        className += ' text-primary';
        toolTip += ' connecting';
    } else {
        className += ' text-danger';
        toolTip += ' disconnected';
    }

    let lobbyStatus = (
        <li>
            <span className={className} title={toolTip} />
        </li>
    );

    className = 'glyphicon glyphicon-signal';
    toolTip = 'Game server is';
    if (currentGame) {
        if (gameConnected) {
            className += ' text-success';
            toolTip += ' connected';
        } else if (gameConnecting) {
            className += ' text-primary';
            toolTip += ' connecting';
        } else {
            className += ' text-danger';
            toolTip += ' disconnected';
        }
    } else {
        toolTip += ' not needed at this time';
    }

    let gameStatus = (
        <li>
            <span className={className} title={toolTip} />
        </li>
    );

    return (
        <nav className='navbar navbar-inverse navbar-fixed-top navbar-sm'>
            <div className='container'>
                <div className='navbar-header'>
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
                    <Link href='/' className='navbar-brand'>
                        {title}
                    </Link>
                </div>
                <div id='navbar' className='collapse navbar-collapse'>
                    <ul className='nav navbar-nav'>{leftMenuToRender}</ul>
                    <ul className='nav navbar-nav navbar-right'>
                        <ContextMenu />
                        {numGames}
                        {lobbyStatus}
                        {gameStatus}
                        {rightMenuToRender}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
