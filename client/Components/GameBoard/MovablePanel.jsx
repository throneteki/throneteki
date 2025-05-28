import React, { useState, useCallback, useRef, useEffect } from 'react';

import { ItemTypes } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { useDndMonitor, useDraggable } from '@dnd-kit/core';
import classNames from 'classnames';
import { createPortal } from 'react-dom';

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
    const popupRef = useRef(null);
    const key = `${name}-${id}`;

    const getSavedPosition = (key) => {
        const raw = localStorage.getItem(key);
        if (!raw) {
            return null;
        }
        const parsed = JSON.parse(raw);
        return {
            x: parsed.x || parsed.left,
            y: parsed.y || parsed.top
        };
    };
    const [startPosition, setStartPosition] = useState(getSavedPosition(key));

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

    const getDefaultPosition = useCallback(() => {
        if (anchorRef) {
            // If an anchor ref is provided, place the popup directly above/below it (based on side)
            if (anchorRef.current && popupRef.current) {
                const anchorRect = anchorRef.current.getBoundingClientRect();
                const popupRect = popupRef.current.getBoundingClientRect();
                // Offset to center of anchor
                const widthOffset = anchorRect.width / 2 - popupRect.width / 2;
                // Offset by anchor height for top side, popup height for bottom
                const heightOffset =
                    side === 'top'
                        ? anchorRect.height + anchorOffset
                        : -popupRect.height - anchorOffset;

                const anchoredPosition = {
                    x: anchorRect.x + widthOffset,
                    y: anchorRect.y + heightOffset
                };
                setStartPosition(anchoredPosition);
                return anchoredPosition;
            }
        } else {
            // Otherwise, place the popup in the center of the screen
            const centerPosition = {
                x: window.innerWidth / 2 - popupRef.current.clientWidth / 2,
                y: window.innerHeight / 2 - popupRef.current.clientHeight / 2
            };
            setStartPosition(centerPosition);
            return centerPosition;
        }
    }, [anchorOffset, anchorRef, side]);

    const updatePosition = useCallback(
        (offset) => {
            if (popupRef.current) {
                let { x, y } = startPosition || getDefaultPosition();
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
        [getDefaultPosition, startPosition]
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
        'max-h-screen max-w-screen fixed flex flex-col border-primary bg-black/65 rounded-md overflow-hidden'
    );

    return createPortal(
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
        </div>,
        document.querySelector('[data-overlay-container="true"]')
    );
};

export default MovablePanel;
