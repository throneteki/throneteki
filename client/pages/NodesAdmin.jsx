import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import {
    sendGetNodeStausMessage,
    sendRestartNodeMessage,
    sendToggleNodeMessage
} from '../redux/reducers/lobby';

const NodeAdmin = () => {
    const dispatch = useDispatch();
    const nodeStatus = useSelector((state) => state.admin.nodeStatus);
    const isConnected = useSelector((state) => state.lobby.connected);

    useEffect(() => {
        if (isConnected) {
            dispatch(sendGetNodeStausMessage());
        }
    }, [dispatch, isConnected]);

    const onToggleNodeClick = useCallback(
        (node, event) => {
            event.preventDefault();
            dispatch(sendToggleNodeMessage(node.name));
        },
        [dispatch]
    );

    const onRefreshClick = useCallback(
        (event) => {
            event.preventDefault();
            dispatch(sendGetNodeStausMessage('getnodestatus'));
        },
        [dispatch]
    );

    const onRestartNodeClick = useCallback(
        (node, event) => {
            event.preventDefault();
            dispatch(sendRestartNodeMessage(node.name));
        },
        [dispatch]
    );

    const getNodesTable = () => {
        const body = nodeStatus.map((node, index) => (
            <tr key={index}>
                <td>{node.name}</td>
                <td>{node.numGames}</td>
                <td>{node.status}</td>
                <td>{node.version}</td>
                <td>
                    <button
                        type='button'
                        className='btn btn-primary'
                        onClick={(event) => onToggleNodeClick(node, event)}
                    >
                        {node.status === 'active' ? 'Disable' : 'Enable'}
                    </button>
                    <button
                        type='button'
                        className='btn btn-primary'
                        onClick={(event) => onRestartNodeClick(node, event)}
                    >
                        Restart
                    </button>
                </td>
            </tr>
        ));

        return (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>Node Name</th>
                        <th>Num Games</th>
                        <th>Status</th>
                        <th>Version</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>{body}</tbody>
            </table>
        );
    };

    let content;

    if (!nodeStatus) {
        content = <div>Waiting for game node status from the lobby...</div>;
    } else if (nodeStatus.length > 0) {
        content = getNodesTable();
    } else {
        content = <div>There are no game nodes connected. This is probably bad.</div>;
    }

    return (
        <div className='col-sm-offset-1 col-sm-10'>
            <Panel title='Game Node Administration'>
                {content}

                <button className='btn btn-default' onClick={onRefreshClick}>
                    Refresh
                </button>
            </Panel>
        </div>
    );
};

export default NodeAdmin;
