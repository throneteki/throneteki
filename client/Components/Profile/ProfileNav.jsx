import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import { Avatar } from '@heroui/react';
import { navigate } from '../../redux/reducers/navigation';
import { ProfileSections } from './ProfileSections';

const ProfileNav = ({ user, activeSection, dirtySections, errorSections }) => {
    const dispatch = useDispatch();
    const avatarVersion = useSelector((state) => state.auth.avatarVersion);

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
        <nav
            aria-label='Profile sections'
            className='rounded-large border-2 border-primary bg-black/75 p-2 shadow-lg lg:sticky lg:top-2'
        >
            <div className='mb-2 hidden items-center gap-2 border-b border-default-200 px-2 pb-3 pt-1 lg:flex'>
                <Avatar
                    size='sm'
                    src={`/img/avatar/${user.username}.png?v=${avatarVersion}`}
                    showFallback
                />
                <span className='truncate font-bold'>{user.username}</span>
            </div>
            <ul className='grid grid-cols-2 gap-1 sm:flex lg:flex-col'>
                {ProfileSections.map((section) => {
                    const path = `/profile/${section.key}`;
                    const isActive = section.key === activeSection;
                    const hasError = errorSections.includes(section.key);
                    const isDirty = dirtySections.includes(section.key);

                    return (
                        <li key={section.key} className='sm:flex-1 lg:flex-none'>
                            <a
                                href={path}
                                aria-current={isActive ? 'page' : undefined}
                                onClick={(event) => onClick(event, path)}
                                className={classNames(
                                    'flex items-center justify-center gap-2 whitespace-nowrap rounded-medium px-3 py-2 text-small transition-colors lg:justify-between',
                                    isActive
                                        ? 'bg-primary font-bold text-primary-foreground'
                                        : 'text-default-600 hover:bg-default-100 hover:text-foreground'
                                )}
                            >
                                {section.label}
                                {(hasError || isDirty) && (
                                    <span
                                        title={hasError ? 'Has errors' : 'Unsaved changes'}
                                        className={classNames(
                                            'h-2 w-2 shrink-0 rounded-full',
                                            hasError ? 'bg-danger' : 'bg-warning'
                                        )}
                                    />
                                )}
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
};

export default ProfileNav;
