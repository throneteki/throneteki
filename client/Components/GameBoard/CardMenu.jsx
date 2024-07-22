import React, { useCallback } from 'react';
import classNames from 'classnames';

const CardMenu = ({ menu, onMenuItemClick }) => {
    const handleMenuItemClick = useCallback(
        (menuItem) => {
            if (onMenuItemClick) {
                onMenuItemClick(menuItem);
            }
        },
        [onMenuItemClick]
    );

    const menuItems = menu.map((menuItem, index) => {
        let className = classNames('menu-item', {
            disabled: !!menuItem.disabled
        });
        return (
            <div key={index} className={className} onClick={() => handleMenuItemClick(menuItem)}>
                {menuItem.text}
            </div>
        );
    });

    return <div className='panel menu'>{menuItems}</div>;
};

export default CardMenu;
