import React from 'react';
import classNames from 'classnames';
import { useSelector } from 'react-redux';
import NavigationLink from '../Site/NavigationLink';

export const navItemClassName =
    'cursor-pointer font-medium text-gold transition-colors duration-300 hover:text-ink';

const NavItem = ({ className, children, path }) => {
    const { path: currentPath } = useSelector((state) => state.navigation);
    const isCurrent = path && (path === currentPath || currentPath?.startsWith(`${path}/`));

    return (
        <NavigationLink
            href={path}
            className={classNames(
                navItemClassName,
                { 'brightness-150 light:brightness-75': isCurrent },
                className
            )}
        >
            {children}
        </NavigationLink>
    );
};

export default NavItem;
