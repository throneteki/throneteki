import React, { useCallback } from 'react';
import { Button } from '@nextui-org/react';

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
        return (
            <Button
                key={index}
                className={'cursor-pointer'}
                variant='ghost'
                size='sm'
                radius='sm'
                isDisabled={!!menuItem.disabled}
                onPress={() => handleMenuItemClick(menuItem)}
            >
                {menuItem.text}
            </Button>
        );
    });

    return (
        <div className='bg-black/65 p-1 absolute top-0 left-full z-20 flex gap-1 flex-col rounded-md'>
            {menuItems}
        </div>
    );
};

export default CardMenu;
