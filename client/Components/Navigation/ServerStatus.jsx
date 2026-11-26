import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimesCircle, faBan } from '@fortawesome/free-solid-svg-icons';

export const connectionStatusOf = ({ connected, connecting }) =>
    (connected && 'Connected') || (connecting && 'Connecting') || 'Disconnected';

export const connectionIconOf = ({ connected, connecting }) =>
    (connected && faCheckCircle) || (connecting && faTimesCircle) || faBan;

export const pingLevelOf = ({ connected, connecting, responseTime }) =>
    connected
        ? responseTime
            ? (responseTime < 150 && 'success') || (responseTime < 300 && 'warning') || 'danger'
            : 'neutral'
        : connecting
          ? 'warning'
          : 'danger';

const pingClasses = {
    success: 'text-success',
    warning: 'text-warning',
    danger: 'text-danger',
    neutral: 'text-ink-dim'
};

export const pingTextOf = (server) =>
    server.connected
        ? server.responseTime
            ? `${server.responseTime}ms`
            : 'Waiting'
        : connectionStatusOf(server);

const ServerStatus = ({ connecting, connected, responseTime, serverType }) => {
    const server = { connecting, connected, responseTime };
    const toolTip = `${serverType} is ${connectionStatusOf(server)}`;
    const pingLevel = pingClasses[pingLevelOf(server)];
    const pingText2 = `${serverType[0]}: ${pingTextOf(server)}`;
    const connectionIcon = connectionIconOf(server);

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
