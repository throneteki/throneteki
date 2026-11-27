import React from 'react';
import classNames from 'classnames';
import NavBar from './NavBar';
import { navbarMenuOpen, useBoardNavbar } from '../../boardLayoutStore';

// On a phone the board takes the whole screen; the navbar slides down over it while the game menu is open, so the
// rest of the site (such as the profile) can still be reached
const BoardNavBar = () => {
    const open = useBoardNavbar();
    const shown = open.gameMenu || navbarMenuOpen(open);

    return (
        <div
            data-board-navbar=''
            // Usable while the game menu (a modal) is open, and not a tap outside it. Always set: react-aria reads it as
            // the menu opens, before the navbar shows.
            data-react-aria-top-layer=''
            aria-hidden={!shown}
            inert={!shown}
            className={classNames(
                // Tailwind's translate-* set the translate property, not transform
                'fixed inset-x-0 top-0 z-40 bg-background pt-(--safe-top) transition-[translate,box-shadow] duration-300 ease-in-out motion-reduce:transition-none',
                shown ? 'translate-y-0 shadow-[0_4px_16px_rgba(0,0,0,0.6)]' : '-translate-y-full'
            )}
        >
            <NavBar overBoard />
        </div>
    );
};

export default BoardNavBar;
