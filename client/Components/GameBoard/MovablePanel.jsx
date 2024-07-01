import React, { useState, useCallback, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDrag } from 'react-dnd';
import $ from 'jquery';

import { ItemTypes } from '../../constants';
import PopupDefaults from './PopupDefaults';

const MovablePanel = ({ name, side, title, onCloseClick, children }) => {
    const key = `${name}-${side}`;
    const savedStyle = localStorage.getItem(key);
    const initialStyle = (savedStyle && JSON.parse(savedStyle)) || PopupDefaults[key];

    const [position, setPosition] = useState(Object.assign({}, initialStyle));
    const popupRef = useRef(null);

    const [{ isDragging, dragOffset }, drag, preview] = useDrag({
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

    return (
        <div ref={popupRef} className='popup' style={position}>
            <div ref={drag} className='panel-title' onClick={(event) => event.stopPropagation()}>
                <span className='text-center'>{title}</span>
                <span className='pull-right'>
                    <a className='close-button glyphicon glyphicon-remove' onClick={onCloseClick} />
                </span>
            </div>
            {children}
        </div>
    );
};

export default MovablePanel;
