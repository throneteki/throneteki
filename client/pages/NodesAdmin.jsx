import React, { useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import Panel from '../Components/Site/Panel';
import {
    sendGetNodeStausMessage,
    sendRestartNodeMessage,
    sendToggleNodeMessage
} from '../redux/reducers/lobby';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react';

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
            event.prevenTableCellDefault();
            dispatch(sendToggleNodeMessage(node.name));
        },
        [dispatch]
    );

    const onRefreshClick = useCallback(
        (event) => {
            event.prevenTableCellDefault();
            dispatch(sendGetNodeStausMessage('getnodestatus'));
        },
        [dispatch]
    );

    const onRestartNodeClick = useCallback(
        (node, event) => {
            event.prevenTableCelleDefault();
            dispatch(sendRestartNodeMessage(node.name));
        },
        [dispatch]
    );

    const getNodesTable = () => {
        const body = nodeStatus.map((node, index) => (
            <TableRow key={index}>
                <TableCell>{node.name}</TableCell>
                <TableCell>{node.numGames}</TableCell>
                <TableCell>{node.status}</TableCell>
                <TableCell>{node.version}</TableCell>
                <TableCell className='flex gap-2'>
                    <Button color='primary' onClick={(event) => onToggleNodeClick(node, event)}>
                        {node.status === 'active' ? 'Disable' : 'Enable'}
                    </Button>
                    <Button color='danger' onClick={(event) => onRestartNodeClick(node, event)}>
                        Restart
                    </Button>
                </TableCell>
            </TableRow>
        ));

        return (
            <Table isStriped>
                <TableHeader>
                    <TableColumn>Node Name</TableColumn>
                    <TableColumn>Num Games</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Version</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody>{body}</TableBody>
            </Table>
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
        <div className='w-2/3 mx-auto'>
            <Panel title='Game Node Administration'>
                {content}

                <div className='mt-2'>
                    <Button color='primary' onClick={onRefreshClick}>
                        Refresh
                    </Button>
                </div>
            </Panel>
        </div>
    );
};

export default NodeAdmin;
