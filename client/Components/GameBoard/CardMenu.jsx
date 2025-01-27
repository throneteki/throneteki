import React, { useCallback } from 'react';
import { Button } from '@heroui/react';

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
            <div className='w-full' key={index}>
                <Button
                    className='text-wrap h-full min-h-10 w-full'
                    variant='ghost'
                    size='sm'
                    radius='sm'
                    isDisabled={!!menuItem.disabled}
                    onPress={() => handleMenuItemClick(menuItem)}
                >
                    {menuItem.text}
                </Button>
            </div>
        );
    });

    return (
        <div className='bg-black/65 p-1 absolute top-0 left-full z-50 flex flex-col gap-0.5 w-[10rem] rounded-lg'>
            {menuItems}
        </div>
    );
};

export default CardMenu;
