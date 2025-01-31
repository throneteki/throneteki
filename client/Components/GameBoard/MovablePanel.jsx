import React, { useState, useCallback, useRef, useEffect } from 'react';
import $ from 'jquery';

import { ItemTypes } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { PopupDefaults } from './PopupDefaults';
import { useDndMonitor, useDraggable } from '@dnd-kit/core';

const MovablePanel = ({ name, side, title, onCloseClick, children, size }) => {
    const key = `${name}-${side}`;
    const savedStyle = localStorage.getItem(key);
    const initialStyle = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

    const [position, setPosition] = useState(Object.assign({}, initialStyle));
    const [startPosition, setStartPosition] = useState();
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

            const currentPos = popupRef.current.getBoundingClientRect();

            setStartPosition(currentPos);
        },
        onDragEnd(event) {
            if (
                event.active.data.current.type !== ItemTypes.PANEL ||
                event.active.data.current.key !== key
            ) {
                return;
            }

            const offset = event.delta;

            updatePosition(offset);

            const style = {
                left: startPosition.left + offset.x,
                top: startPosition.top + offset.y
            };

            localStorage.setItem(`${name}-${side}`, JSON.stringify(style));
        }
    });

    const updatePosition = useCallback(
        (dragOffset) => {
            const popup = $(popupRef.current);

            const style = {
                position: 'fixed',
                left: Math.max(startPosition.left + dragOffset.x, 0),
                top: Math.max(startPosition.top + dragOffset.y, 50)
            };

            if (style.left + popup.width() > window.innerWidth) {
                style.left = window.innerWidth - popup.width();
            }

            if (style.top + popup.height() > window.innerHeight) {
                style.top = window.innerHeight - popup.height();
            }

            setPosition(style);
        },
        [startPosition?.left, startPosition?.top]
    );

    useEffect(() => {
        if (transform) {
            updatePosition(transform);
        }
    }, [transform, updatePosition]);

    return (
        <div
            ref={popupRef}
            className={`panel border-primary bg-black/65 ${size} rounded-md fixed z-50 overflow-hidden`}
            style={position}
        >
            <div
                {...attributes}
                {...listeners}
                ref={setNodeRef}
                className='flex justify-end border-b-1 border-foreground border-transparent bg-primary p-1.5 text-center font-bold text-white opacity-100'
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
