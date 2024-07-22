import React, { useState, useCallback } from 'react';

const SideBar = ({ children }) => {
    const [expanded, setExpanded] = useState(false);

    const onBurgerClick = useCallback(
        (event) => {
            event.preventDefault();
            setExpanded(!expanded);
        },
        [expanded]
    );

    let component = expanded ? (
        <div className='sidebar expanded' key='sidebar-expanded'>
            <div>
                <a href='#' className='btn pull-right' onClick={onBurgerClick}>
                    <span className='glyphicon glyphicon-remove' />
                </a>
                {children}
            </div>
        </div>
    ) : (
        <div className='sidebar collapsed' key='sidebar'>
            <div>
                <a href='#' className='btn' onClick={onBurgerClick}>
                    <span className='glyphicon glyphicon-menu-hamburger' />
                </a>
            </div>
        </div>
    );

    return component;
};

export default SideBar;
