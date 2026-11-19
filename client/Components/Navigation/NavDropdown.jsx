import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Dropdown, Label } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { navigate } from '../../redux/reducers/navigation';
import { navItemClassName } from './NavItem';

const NavDropdown = ({ title, items, trigger, triggerLabel, onNavigate }) => {
    const dispatch = useDispatch();
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Dropdown isOpen={isOpen} onOpenChange={setIsOpen}>
            <Dropdown.Trigger
                aria-label={triggerLabel}
                className={classNames(
                    'flex items-center gap-1 rounded-sm bg-transparent outline-none data-[focus-visible=true]:outline-2 data-[focus-visible=true]:outline-gold',
                    !trigger && navItemClassName
                )}
            >
                {trigger || (
                    <>
                        {title}
                        <FontAwesomeIcon icon={isOpen ? faChevronUp : faChevronDown} />
                    </>
                )}
            </Dropdown.Trigger>
            <Dropdown.Popover placement='bottom start' className='min-w-44'>
                <Dropdown.Menu
                    aria-label={title || triggerLabel}
                    onAction={(path) => {
                        onNavigate?.();
                        dispatch(navigate(path));
                    }}
                >
                    {items.map((item) => (
                        <Dropdown.Item key={item.path} id={item.path} textValue={item.title}>
                            <Label className='font-medium text-gold'>{item.title}</Label>
                        </Dropdown.Item>
                    ))}
                </Dropdown.Menu>
            </Dropdown.Popover>
        </Dropdown>
    );
};

export default NavDropdown;
