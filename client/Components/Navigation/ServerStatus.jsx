import React from 'react';

const ServerStatus = (props) => {
    const { connecting, connected, responseTime, serverType } = props;

    const connectionStatus =
        (connected && 'Connected') || (connecting && 'Connecting') || 'Disconnected';
    let className =
        (connected && 'glyphicon-ok-sign') ||
        (connecting && 'glyphicon-remove-sign') ||
        'glyphicon-ban-circle';

    className += ' glyphicon';

    const toolTip = `${serverType} is ${connectionStatus}`;

    const pingLevel = `text-${
        connected
            ? responseTime
                ? (responseTime < 150 && 'success') || (responseTime < 300 && 'warning') || 'danger'
                : 'neutral'
            : connecting
              ? 'warning'
              : 'danger'
    }`;

    const pingText2 = `${serverType[0]}: ${
        connected ? (responseTime ? `${responseTime}ms` : 'Waiting') : connectionStatus
    }`;

    return (
        <li className='navbar-item'>
            <span className={pingLevel}>
                {pingText2} <span className={className} title={toolTip} />
            </span>
        </li>
    );
};

export default ServerStatus;
