import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import classNames from 'classnames';
import { Button, Table } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRotate } from '@fortawesome/free-solid-svg-icons';

import {
    sendGetNodeStausMessage,
    sendRestartNodeMessage,
    sendToggleNodeMessage
} from '../redux/reducers/lobby';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Notice from '../Components/Site/Notice';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import AdminPage from './AdminPage';
import { createMockNodes, isMockMode } from '../dev/mockData';

const Statuses = {
    active: { label: 'Active', dot: 'bg-success' },
    draining: { label: 'Draining', dot: 'bg-warning' },
    disabled: { label: 'Disabled', dot: 'bg-ink-faint' },
    disconnected: { label: 'Disconnected', dot: 'bg-danger' }
};

const NodeStatus = ({ status }) => {
    const info = Statuses[status] ?? { label: status, dot: 'bg-ink-faint' };

    return (
        <span className='flex items-center gap-2'>
            <span aria-hidden className={classNames('h-2 w-2 rounded-full', info.dot)} />
            {info.label}
        </span>
    );
};

const NodeAdmin = () => {
    const dispatch = useDispatch();
    const liveNodeStatus = useSelector((state) => state.admin.nodeStatus);
    const [mockNodes] = useState(() =>
        import.meta.env.DEV && isMockMode() ? createMockNodes() : undefined
    );
    const nodeStatus = mockNodes ?? liveNodeStatus;
    const isConnected = useSelector((state) => state.lobby.connected);
    const [restarting, setRestarting] = useState();

    useEffect(() => {
        if (isConnected) {
            dispatch(sendGetNodeStausMessage());
        }
    }, [dispatch, isConnected]);

    const games = nodeStatus?.reduce((total, node) => total + (node.numGames || 0), 0) ?? 0;
    const active = nodeStatus?.filter((node) => node.status === 'active').length ?? 0;

    let content;
    if (!nodeStatus) {
        content = <LoadingSpinner className='py-10' label='Asking the nodes for their status' />;
    } else if (nodeStatus.length === 0) {
        content = (
            <Notice kind='error' title='No game nodes are connected'>
                Nobody can start a game until a node connects.
            </Notice>
        );
    } else {
        content = (
            <Table variant='secondary'>
                <Table.ScrollContainer>
                    <Table.Content aria-label='Game nodes'>
                        <Table.Header>
                            <Table.Column isRowHeader>Node</Table.Column>
                            <Table.Column>Status</Table.Column>
                            <Table.Column className='text-right'>Games</Table.Column>
                            <Table.Column>Version</Table.Column>
                            <Table.Column>
                                <span className='sr-only'>Actions</span>
                            </Table.Column>
                        </Table.Header>
                        <Table.Body>
                            {nodeStatus.map((node) => (
                                <Table.Row key={node.name} id={node.name}>
                                    <Table.Cell className='font-medium text-ink'>
                                        {node.name}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <NodeStatus status={node.status} />
                                    </Table.Cell>
                                    <Table.Cell className='text-right tabular-nums'>
                                        {node.numGames}
                                    </Table.Cell>
                                    <Table.Cell className='text-ink-dim'>{node.version}</Table.Cell>
                                    <Table.Cell>
                                        <div className='flex justify-end gap-1'>
                                            <Button
                                                size='sm'
                                                variant='tertiary'
                                                onPress={() =>
                                                    dispatch(sendToggleNodeMessage(node.name))
                                                }
                                            >
                                                {node.status === 'disabled' ? 'Enable' : 'Disable'}
                                            </Button>
                                            <Button
                                                size='sm'
                                                variant='ghost'
                                                className='text-danger'
                                                onPress={() => setRestarting(node)}
                                            >
                                                Restart
                                            </Button>
                                        </div>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        );
    }

    return (
        <AdminPage
            section='nodes'
            title='Game nodes'
            description={
                nodeStatus?.length
                    ? `${active} of ${nodeStatus.length} ${nodeStatus.length === 1 ? 'node' : 'nodes'} taking games, running ${games} ${games === 1 ? 'game' : 'games'}. A disabled node finishes its games but gets no new ones.`
                    : 'The servers that run games.'
            }
            actions={
                <Button
                    variant='tertiary'
                    isDisabled={!isConnected}
                    onPress={() => dispatch(sendGetNodeStausMessage())}
                >
                    <FontAwesomeIcon icon={faRotate} />
                    Refresh
                </Button>
            }
        >
            {content}
            <ConfirmDialog
                isOpen={!!restarting}
                isDestructive
                title={restarting && `Restart ${restarting.name}?`}
                message={
                    restarting &&
                    `Its ${restarting.numGames} ${restarting.numGames === 1 ? 'game ends' : 'games end'} straight away. To let games finish first, disable it and wait.`
                }
                okLabel='Restart'
                onOpenChange={(open) => !open && setRestarting(undefined)}
                onCancel={() => setRestarting(undefined)}
                onOk={() => {
                    dispatch(sendRestartNodeMessage(restarting.name));
                    setRestarting(undefined);
                }}
            />
        </AdminPage>
    );
};

export default NodeAdmin;
