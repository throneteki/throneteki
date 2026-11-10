import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

import { useDragMove } from './useDragMove';

const MovablePanel = ({
    name,
    side,
    id = side,
    title,
    onCloseClick,
    anchorRef,
    anchorOffset = 10,
    children,
    className
}) => {
    const { panelRef, handleRef } = useDragMove({
        storageKey: `${name}-${id}`,
        getDefaultPosition: (panel) => {
            if (anchorRef?.current) {
                const anchorRect = anchorRef.current.getBoundingClientRect();
                return {
                    x: anchorRect.x + anchorRect.width / 2 - panel.offsetWidth / 2,
                    y:
                        side === 'top'
                            ? anchorRect.y + anchorRect.height + anchorOffset
                            : anchorRect.y - panel.offsetHeight - anchorOffset
                };
            }

            return {
                x: window.innerWidth / 2 - panel.offsetWidth / 2,
                y: window.innerHeight / 2 - panel.offsetHeight / 2
            };
        }
    });

    const wrapperClass = classNames(
        className,
        'max-h-screen max-w-screen fixed top-0 left-0 flex flex-col border-primary bg-black/65 rounded-md overflow-hidden'
    );

    return createPortal(
        <div ref={panelRef} className={wrapperClass}>
            <div
                ref={handleRef}
                className='flex justify-end hud-zoom border-b-1 border-foreground border-transparent bg-primary p-1.5 text-center font-bold text-white opacity-100 h-auto touch-none cursor-grab select-none'
                onClick={(event) => event.stopPropagation()}
            >
                <span className='flex-1 text-center'>{title}</span>
                <span className='cursor-pointer' data-no-drag>
                    <a onClick={onCloseClick}>
                        <FontAwesomeIcon icon={faTimes} />
                    </a>
                </span>
            </div>
            {children}
        </div>,
        document.querySelector('[data-overlay-container="true"]')
    );
};

export default MovablePanel;
