import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons';

const ServerStatus = ({ connecting, connected, responseTime, serverType }) => {
    const connectionStatus =
        (connected && 'Connected') || (connecting && 'Connecting') || 'Disconnected';
    const connectionIcon = (connected && faCheckCircle) || (connecting && faTimesCircle) || faBan;

    const toolTip = `${serverType} is ${connectionStatus}`;

    let pingLevel = 'text-danger';
    if (connected && !responseTime) {
        pingLevel = 'text-ink-dim';
    } else if (connected && responseTime < 150) {
        pingLevel = 'text-success';
    } else if ((connected && responseTime < 300) || (!connected && connecting)) {
        pingLevel = 'text-warning';
    }

    const pingText2 = `${serverType[0]}: ${
        connected ? (responseTime ? `${responseTime}ms` : 'Waiting') : connectionStatus
    }`;

    return (
        <div className='font-medium text-lg text-nowrap'>
            <span className={pingLevel}>
                {pingText2} <FontAwesomeIcon icon={connectionIcon} title={toolTip} />
            </span>
        </div>
    );
};

ServerStatus.displayName = 'ServerStatus';

export default ServerStatus;
