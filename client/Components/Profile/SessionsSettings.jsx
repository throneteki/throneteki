import React, { useState } from 'react';
import moment from 'moment';
import { Button, Table } from '@heroui/react';
import { toast } from 'react-toastify';
import { useGetUserSessionsQuery, useRemoveSessionMutation } from '../../redux/middleware/api';
import ConfirmDialog from '../Site/ConfirmDialog';
import LoadingSpinner from '../Site/LoadingSpinner';
import Notice from '../Site/Notice';

const SessionsSettings = ({ user }) => {
    const { data: sessions, isLoading, error } = useGetUserSessionsQuery(user.username);
    const [removeSession, { isLoading: isRemoving }] = useRemoveSessionMutation();
    const [removingSession, setRemovingSession] = useState(null);

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <Notice kind='error'>
                {error.data?.message || "Your sessions couldn't be loaded. Try again later."}
            </Notice>
        );
    }

    return (
        <>
            <Table variant='secondary'>
                <Table.ScrollContainer>
                    <Table.Content aria-label='Sessions'>
                        <Table.Header>
                            <Table.Column isRowHeader>IP address</Table.Column>
                            <Table.Column>Last used</Table.Column>
                            <Table.Column>
                                <span className='sr-only'>Actions</span>
                            </Table.Column>
                        </Table.Header>
                        <Table.Body
                            renderEmptyState={() => "You have no sessions. This shouldn't happen."}
                        >
                            {(sessions || []).map((session) => (
                                <Table.Row key={session.id} id={session.id}>
                                    <Table.Cell>{session.ip}</Table.Cell>
                                    <Table.Cell className='tabular-nums text-ink-dim'>
                                        {moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}
                                    </Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            size='sm'
                                            isDisabled={isRemoving}
                                            onPress={() => setRemovingSession(session)}
                                            variant='ghost'
                                            className='text-danger'
                                        >
                                            Remove
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
            <ConfirmDialog
                isOpen={!!removingSession}
                message='Remove this session? It will be logged out, and any game it is playing may be abandoned.'
                onOpenChange={(open) => !open && setRemovingSession(null)}
                onCancel={() => setRemovingSession(null)}
                onOk={async () => {
                    try {
                        await removeSession({
                            username: user.username,
                            sessionId: removingSession.id
                        }).unwrap();
                        toast.success(`Session '${removingSession.ip}' removed`);
                        setRemovingSession(null);
                    } catch (err) {
                        toast.error(
                            err.data?.message ||
                                err.message ||
                                "The session couldn't be removed. Please try again later."
                        );
                    }
                }}
            />
        </>
    );
};

export default SessionsSettings;
