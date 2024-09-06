import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons';

const ServerStatus = ({ connecting, connected, responseTime, serverType }) => {
    const connectionStatus =
        (connected && 'Connected') || (connecting && 'Connecting') || 'Disconnected';
    const connectionIcon = (connected && faCheckCircle) || (connecting && faTimesCircle) || faBan;

    const toolTip = `${serverType} is ${connectionStatus}`;

    const pingLevel = `text-medium text-${
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
        <div className='font-[PoppinsMedium] text-large'>
            <span className={pingLevel}>
                {pingText2} <FontAwesomeIcon icon={connectionIcon} title={toolTip} />
            </span>
        </div>
    );
};

ServerStatus.displayName = 'ServerStatus';

export default ServerStatus;
