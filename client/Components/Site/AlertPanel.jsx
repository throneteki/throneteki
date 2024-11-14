import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faExclamationCircle,
    faExclamationTriangle,
    faInfoCircle,
    faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from '@nextui-org/react';

export const AlertType = Object.freeze({
    Default: 'default',
    Primary: 'primary',
    Info: 'info',
    Warning: 'warning',
    Danger: 'danger',
    Success: 'success',
    Bell: 'bell'
});

function getMessageWithLinks(message) {
    const links = message.match(/(https?:\/\/)?([^.\s]+)?[^.\s]+\.[^\s]+/gi);
    const retMessage = [];

    if (!links || links.length === 0) {
        return message;
    }

    let lastIndex = 0;
    let linkCount = 0;

    for (const link of links) {
        const index = message.indexOf(link);

        retMessage.push(message.substring(lastIndex, index));
        retMessage.push(
            <Link key={linkCount++} href={link}>
                {link}
            </Link>
        );

        lastIndex += index + link.length;
    }

    retMessage.push(message.substr(lastIndex, message.length - lastIndex));

    return retMessage;
}

const AlertPanel = ({
    variant = AlertType.Info,
    title,
    message,
    noIcon = false,
    children,
    size = 'md'
}) => {
    let icon;
    /**
     * @type {AlertType}
     */
    let alertType;

    switch (variant) {
        case AlertType.Warning:
            icon = faExclamationTriangle;
            alertType = 'bg-warning-subtle text-warning-subtle-foreground';
            break;
        case AlertType.Danger:
            icon = faExclamationCircle;
            alertType = 'bg-danger-subtle text-danger-subtle-foreground';
            break;
        case AlertType.Info:
            icon = faInfoCircle;
            alertType = 'bg-info-subtle text-info-subtle-foreground';
            break;
        case AlertType.Success:
            icon = faCheckCircle;
            alertType = 'bg-success-subtle text-success-subtle-foreground';
            break;
    }

    let padding;

    switch (size) {
        case 'sm':
            padding = 'p-2';
            break;
        case 'md':
            padding = 'p-4';
            break;
        case 'lg':
            padding = 'p-6';
            break;
    }

    return (
        <div className={`rounded-lg ${padding} ${alertType}`}>
            {title}
            {!noIcon && <FontAwesomeIcon icon={icon} />}
            {message && <span id='alert-message'>&nbsp;{getMessageWithLinks(message)}</span>}
            {children && <span>&nbsp;{children}</span>}
        </div>
    );
};

export default AlertPanel;
