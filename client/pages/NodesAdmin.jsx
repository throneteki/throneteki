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
} from '@heroui/react';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import AlertPanel from '../Components/Site/AlertPanel';
import Page from './Page';

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
        (node) => {
            dispatch(sendToggleNodeMessage(node.name));
        },
        [dispatch]
    );

    const onRefreshClick = useCallback(() => {
        dispatch(sendGetNodeStausMessage('getnodestatus'));
    }, [dispatch]);

    const onRestartNodeClick = useCallback(
        (node) => {
            dispatch(sendRestartNodeMessage(node.name));
        },
        [dispatch]
    );

    return (
        <Page>
            <Panel title='Game Node Administration'>
                <div className='flex flex-col gap-2'>
                    {!nodeStatus ? (
                        <LoadingSpinner />
                    ) : (
                        <>
                            <Table isStriped>
                                <TableHeader>
                                    <TableColumn>Node Name</TableColumn>
                                    <TableColumn>Num Games</TableColumn>
                                    <TableColumn>Status</TableColumn>
                                    <TableColumn>Version</TableColumn>
                                    <TableColumn>Actions</TableColumn>
                                </TableHeader>
                                <TableBody
                                    emptyContent={
                                        <AlertPanel
                                            variant='warning'
                                            message='There are no game nodes connected. This is probably bad.'
                                        />
                                    }
                                >
                                    {nodeStatus?.map((node, index) => (
                                        <TableRow key={index}>
                                            <TableCell>{node.name}</TableCell>
                                            <TableCell>{node.numGames}</TableCell>
                                            <TableCell>{node.status}</TableCell>
                                            <TableCell>{node.version}</TableCell>
                                            <TableCell className='flex gap-2'>
                                                <Button
                                                    color='primary'
                                                    onPress={(event) =>
                                                        onToggleNodeClick(node, event)
                                                    }
                                                >
                                                    {node.status === 'active'
                                                        ? 'Disable'
                                                        : 'Enable'}
                                                </Button>
                                                <Button
                                                    color='danger'
                                                    onPress={(event) =>
                                                        onRestartNodeClick(node, event)
                                                    }
                                                >
                                                    Restart
                                                </Button>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                            <Button color='primary' className='self-start' onPress={onRefreshClick}>
                                Refresh
                            </Button>
                        </>
                    )}
                </div>
            </Panel>
        </Page>
    );
};

export default NodeAdmin;
