import React, { useLayoutEffect, useRef } from 'react';
import classNames from 'classnames';
import { getActionRequirementReason } from './actionRequirementReasons';

const CardMenu = ({ menu, onMenuItemClick }) => {
    const ref = useRef(null);

    // Shift the menu back inside the viewport rather than letting it be clipped.
    useLayoutEffect(() => {
        const node = ref.current;
        if (!node) {
            return;
        }

        node.style.transform = '';
        const rect = node.getBoundingClientRect();
        const overflowX = Math.max(0, rect.right - window.innerWidth + 8);
        const overflowY = Math.max(0, rect.bottom - window.innerHeight + 8);
        if (overflowX > 0 || overflowY > 0) {
            node.style.transform = `translate(${-overflowX}px, ${-overflowY}px)`;
        }
    }, [menu.length]);

    return (
        <div
            ref={ref}
            className='absolute top-0 left-full z-[300] ml-1 flex w-48 flex-col gap-1 rounded-md border border-default-300 bg-content1 p-1 text-xs shadow-lg shadow-black/60'
            onMouseDown={(event) => event.stopPropagation()}
            onClick={(event) => event.stopPropagation()}
        >
            {menu.map((menuItem, index) => (
                <button
                    key={index}
                    type='button'
                    disabled={!!menuItem.disabled}
                    title={getActionRequirementReason(menuItem.disabledReason)}
                    className={classNames(
                        'rounded border border-default-200 bg-default-100 px-2 py-1 text-left text-foreground',
                        {
                            'cursor-pointer hover:border-primary hover:bg-default-200':
                                !menuItem.disabled,
                            'cursor-not-allowed opacity-50': !!menuItem.disabled
                        }
                    )}
                    onClick={() => onMenuItemClick && onMenuItemClick(menuItem)}
                >
                    {menuItem.text}
                    {menuItem.disabled && menuItem.disabledReason && (
                        <span className='mt-1 block text-[10px] font-normal'>
                            {getActionRequirementReason(menuItem.disabledReason)}
                        </span>
                    )}
                </button>
            ))}
        </div>
    );
};

export default CardMenu;
