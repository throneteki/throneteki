import React, { useLayoutEffect, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { navigate } from '../../redux/reducers/navigation';

const BannerNav = ({ label, items, current }) => {
    const dispatch = useDispatch();
    const listRef = useRef();

    useLayoutEffect(() => {
        const list = listRef.current;
        const active = list?.querySelector('[aria-current="page"]');
        if (active && list.scrollWidth > list.clientWidth) {
            list.scrollLeft = active.offsetLeft - (list.clientWidth - active.offsetWidth) / 2;
        }
    }, [current]);

    const onClick = (event, path) => {
        if (
            event.button !== 0 ||
            event.metaKey ||
            event.ctrlKey ||
            event.shiftKey ||
            event.altKey
        ) {
            return;
        }

        event.preventDefault();
        dispatch(navigate(path));
    };

    return (
        <>
            <div className='banner-rod' />
            <nav aria-label={label} className='banner-nav' ref={listRef}>
                {items.map((item) => (
                    <a
                        key={item.key}
                        href={item.path}
                        aria-current={item.key === current ? 'page' : undefined}
                        onClick={(event) => onClick(event, item.path)}
                    >
                        {item.label}
                        {item.mark && (
                            <span
                                title={item.mark}
                                className='ml-2 mt-[7px] h-1.5 w-1.5 flex-none rotate-45 bg-gold'
                            />
                        )}
                    </a>
                ))}
            </nav>
        </>
    );
};

export default BannerNav;
