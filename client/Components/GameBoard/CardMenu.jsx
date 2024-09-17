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
        let className = classNames(
            'border-1 border-primary rounded-md cursor-pointer py-1 px-2 hover:border-info',
            {
                disabled: !!menuItem.disabled
            }
        );
        return (
            <div key={index} className={className} onClick={() => handleMenuItemClick(menuItem)}>
                {menuItem.text}
            </div>
        );
    });

    return (
        <div className='bg-black bg-opacity-65 p-1 absolute -top-1 left-14 w-52 z-20 flex gap-1 flex-col'>
            {menuItems}
        </div>
    );
};

export default CardMenu;
