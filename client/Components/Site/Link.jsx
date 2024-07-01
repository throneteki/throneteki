import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';

const Link = ({ href, className, children }) => {
    const dispatch = useDispatch();

    const onClick = useCallback(
        (event) => {
            event.preventDefault();
            dispatch(navigate(href));
        },
        [dispatch, href]
    );

    return (
        <a className={className} href={href} onClick={onClick}>
            {children}
        </a>
    );
};

export default Link;
