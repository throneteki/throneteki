import React from 'react';

const AlertPanel = ({ type, multiLine, noIcon, title, message, children }) => {
    let icon = 'glyphicon';
    let alertClass = 'alert fade in';

    switch (type) {
        case 'warning':
            icon += ' glyphicon-warning-sign';
            alertClass += ' alert-warning';
            break;
        case 'error':
            icon += ' glyphicon-exclamation-sign';
            alertClass += ' alert-danger';
            break;
        case 'info':
            icon += ' glyphicon-info-sign';
            alertClass += ' alert-info';
            break;
        case 'success':
            icon += ' glyphicon-ok-sign';
            alertClass += ' alert-success';
            break;
        default:
            break;
    }

    if (multiLine) {
        alertClass += ' multiline';
    }

    return (
        <div className={alertClass} role='alert'>
            {noIcon ? null : <span className={icon} aria-hidden='true' />}
            {title ? <span className='sr-only'>{title}</span> : null}
            {message ? <span>&nbsp;{message}</span> : null}
            &nbsp;{children}
        </div>
    );
};

export default AlertPanel;
