import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import classNames from 'classnames';
import { getMessageWithLinks } from '../../util';

export const AlertType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger',
    Success: 'success',
    Bell: 'bell'
});

const AlertPanel = ({
    variant = AlertType.Info,
    title,
    message,
    noIcon = false,
    children,
    size = 'md'
}) => {
    let icon;
    switch (variant) {
        case AlertType.Warning:
            icon = faExclamationTriangle;
            break;
        case AlertType.Danger:
            icon = faExclamationCircle;
            break;
        case AlertType.Info:
            icon = faInfoCircle;
            break;
        case AlertType.Success:
            icon = faCheckCircle;
            break;
    }
    const containerClass = classNames('flex flex-col gap-1 rounded-lg', {
        'p-2': size === 'sm',
        'p-4': size === 'md',
        'p-6': size === 'lg',
        'bg-warning-subtle text-warning-subtle-foreground': variant === AlertType.Warning,
        'bg-danger-subtle text-danger-subtle-foreground': variant === AlertType.Danger,
        'bg-info-subtle text-info-subtle-foreground': variant === AlertType.Info,
        'bg-success-subtle text-success-subtle-foreground': variant === AlertType.Success
    });
    return (
        <div className={containerClass}>
            {title && <h1 className='text-medium font-bold'>{title}</h1>}
            <div className='flex items-center gap-1'>
                {!noIcon && <FontAwesomeIcon icon={icon} />}
                {message && <span>{getMessageWithLinks(message)}</span>}
                {children && <span>{children}</span>}
            </div>
        </div>
    );
};

export default AlertPanel;
