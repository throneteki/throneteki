import React, { useState, useCallback, useRef, useEffect } from 'react';

import { ItemTypes } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import classNames from 'classnames';
// import { PopupDefaults } from './PopupDefaults';

const MovablePanel = ({ name, side, title, onCloseClick, children, className }) => {
    const key = `${name}-${side}`;
    const savedPosition = localStorage.getItem(key);
    const initialPosition = (savedPosition && JSON.parse(savedPosition)) || { x: 150, y: 150 }; // PopupDefaults[key]; TODO: Implement popup defaults properly/programatically

    const [startPosition, setStartPosition] = useState(initialPosition);
    const popupRef = useRef(null);

    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: key,
        data: {
            type: ItemTypes.PANEL,
            key: key
        }
    });

    useDndMonitor({
        onDragStart(event) {
            if (
                event.active.data.current.type !== ItemTypes.PANEL ||
                event.active.data.current.key !== key
            ) {
                return;
            }

            const { x, y } = popupRef.current.getBoundingClientRect();

            setStartPosition({ x, y });
        },
        onDragEnd(event) {
            if (
                event.active.data.current.type !== ItemTypes.PANEL ||
                event.active.data.current.key !== key
            ) {
                return;
            }

            let { x, y } = popupRef.current.getBoundingClientRect();
            localStorage.setItem(key, JSON.stringify({ x, y }));
            setStartPosition({ x, y });
        }
    });

    const updatePosition = useCallback(
        (offset) => {
            if (popupRef.current) {
                let { x, y } = startPosition;
                x += offset?.x || 0;
                y += offset?.y || 0;
                const height = popupRef.current.clientHeight;
                const width = popupRef.current.clientWidth;
                if (y < 0) {
                    y = 0;
                } else if (y + height >= window.innerHeight) {
                    y = window.innerHeight - height;
                }
                if (x < 0) {
                    x = 0;
                } else if (x + width >= window.innerWidth) {
                    x = window.innerWidth - width;
                }

                popupRef.current.style.top = `${y}px`;
                popupRef.current.style.left = `${x}px`;
            }
        },
        [startPosition]
    );

    useEffect(() => {
        updatePosition(transform);
    }, [transform, updatePosition, popupRef]);

    useEffect(() => {
        window.addEventListener('resize', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
        };
    }, [updatePosition]);

    const wrapperClass = classNames(
        className,
        'max-h-screen max-w-screen fixed flex flex-col border-primary bg-black/65 rounded-md z-[250] overflow-hidden'
    );

    return (
        <div ref={popupRef} className={wrapperClass}>
            <div
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                className='flex justify-end border-b-1 border-foreground border-transparent bg-primary p-1.5 text-center font-bold text-white opacity-100 h-auto touch-none'
                onClick={(event) => event.stopPropagation()}
            >
                <span className='flex-1 text-center'>{title}</span>
                <span className='cursor-pointer'>
                    <a onClick={onCloseClick}>
                        <FontAwesomeIcon icon={faTimes} />
                    </a>
                </span>
            </div>
            {children}
        </div>
    );
};

export default MovablePanel;
