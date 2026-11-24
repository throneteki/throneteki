import React from 'react';
import classNames from 'classnames';
import NavBar from './NavBar';
import { useBoardNavbar } from '../../boardLayoutStore';

// On a phone the board takes the whole screen; the navbar slides down over it while the game menu is open, so the
// rest of the site (such as the profile) can still be reached
const BoardNavBar = () => {
    const { gameMenu, navMenu } = useBoardNavbar();
    const shown = gameMenu || navMenu;

    return (
        <div
            data-board-navbar=''
            aria-hidden={!shown}
            {...(shown ? {} : { inert: '' })}
            className={classNames(
                'fixed inset-x-0 top-0 z-40 bg-background pt-[var(--safe-top)] transition-[transform,box-shadow] duration-200 ease-out',
                shown ? 'transform-none shadow-[0_4px_16px_rgba(0,0,0,0.6)]' : '-translate-y-full'
            )}
        >
            <NavBar overBoard />
        </div>
    );
};

export default BoardNavBar;
