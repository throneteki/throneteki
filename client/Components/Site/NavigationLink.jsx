import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';

const NavigationLink = ({ href, className, children }) => {
    const dispatch = useDispatch();

    const onPointerDown = useCallback(
        (event) => {
            event.preventDefault();
            dispatch(navigate(href));
        },
        [dispatch, href]
    );

    return (
        <a className={className} href={href} onClick={onPointerDown} onPointerDown={onPointerDown}>
            {children}
        </a>
    );
};

export default NavigationLink;
