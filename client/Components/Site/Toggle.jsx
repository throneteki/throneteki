import React from 'react';
import { Switch } from '@heroui/react';
import classNames from 'classnames';

const Toggle = ({
    name,
    isSelected,
    onChange,
    onValueChange,
    isDisabled,
    size = 'sm',
    className,
    contentClassName,
    'aria-label': ariaLabel,
    children
}) => (
    <Switch
        size={size}
        isSelected={!!isSelected}
        isDisabled={isDisabled}
        aria-label={children ? undefined : ariaLabel}
        name={name}
        onChange={(selected) => {
            onChange?.({
                persist: () => {},
                target: { name, id: name, type: 'checkbox', checked: selected }
            });
            onValueChange?.(selected);
        }}
        className={className}
    >
        <Switch.Content className={classNames('flex items-center gap-3', contentClassName)}>
            <Switch.Control>
                <Switch.Thumb />
            </Switch.Control>
            {children}
        </Switch.Content>
    </Switch>
);

export default Toggle;
