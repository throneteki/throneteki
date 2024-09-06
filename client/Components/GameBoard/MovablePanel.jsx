import React, { useState, useCallback, useRef, useEffect } from 'react';
import { useDrag } from 'react-dnd';
import $ from 'jquery';

import { ItemTypes } from '../../constants';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

const PopupDefaults = {
    'plot deck-bottom': {
        left: '100px',
        bottom: '155px'
    },
    'revealed plots-bottom': {
        left: '100px',
        bottom: '230px'
    },
    'revealed plots-top': {
        left: '100px',
        top: '155px'
    },
    'draw deck-top': {
        top: '185px;'
    },
    'draw deck-bottom': {
        bottom: '140px'
    },
    'discard pile-bottom': {
        bottom: '155px'
    },
    'discard pile-top': {
        top: '185px'
    },
    'dead pile-bottom': {
        bottom: '140px'
    },
    'dead pile-top': {
        top: '165px'
    },
    'out of game-top': {
        top: '155px',
        left: '20px'
    },
    'out of game-bottom': {
        bottom: '155px',
        right: '0'
    },
    'agenda-bottom': {
        bottom: '155px'
    },
    'agenda-top': {
        top: '185px'
    }
};

const MovablePanel = ({ name, side, title, onCloseClick, children, size }) => {
    const key = `${name}-${side}`;
    const savedStyle = localStorage.getItem(key);
    const initialStyle = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

    const [position, setPosition] = useState(Object.assign({}, initialStyle));
    const popupRef = useRef(null);

    const [{ isDragging, dragOffset }, drag] = useDrag({
        type: ItemTypes.PANEL,
        item: { name: `${name}-${side}` },
        end: (item, monitor) => {
            const offset = monitor.getSourceClientOffset();
            updatePosition(offset);

            const style = {
                left: offset.x,
                top: offset.y,
                position: 'fixed'
            };

            localStorage.setItem(`${name}-${side}`, JSON.stringify(style));
        },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
            dragOffset: monitor.getSourceClientOffset()
        })
    });

    const updatePosition = useCallback(
        (dragOffset) => {
            let style = {
                position: 'fixed',
                left: Math.max(dragOffset.x, 0),
                top: Math.max(dragOffset.y, 50)
            };

            const popup = $(popupRef.current);

            if (style.left + popup.width() > window.innerWidth) {
                style.left = window.innerWidth - popup.width();
            }

            if (style.top + popup.height() > window.innerHeight) {
                style.top = window.innerHeight - popup.height();
            }

            setPosition(style);
        },
        [setPosition]
    );

    useEffect(() => {
        if (isDragging) {
            updatePosition(dragOffset);
        }
    }, [dragOffset, isDragging, updatePosition]);

    return (
        <div
            ref={popupRef}
            className={`panel border-primary bg-black bg-opacity-65 ${size} rounded-b-md fixed z-50`}
            style={position}
        >
            <div
                ref={drag}
                className='rounded-t-md flex justify-end border-b-1 border-foreground border-transparent bg-primary p-1.5 text-center font-bold text-white opacity-100'
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
