import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import AlertPanel, { AlertType } from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useGetUserSessionsQuery, useRemoveSessionMutation } from '../redux/middleware/api';
import {
    Link,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Page from './Page';

const Security = () => {
    const user = useSelector((state) => state.auth.user);
    const {
        data: sessions,
        isLoading,
        error
    } = useGetUserSessionsQuery(user?.username, { skip: !user });
    const [removeSession, { isLoading: isRemoving }] = useRemoveSessionMutation();
    const [removingSession, setRemovingSession] = useState(null);

    return (
        <>
            <Page>
                {error && (
                    <AlertPanel
                        variant={AlertType.Danger}
                        message={error.data?.message || 'An error occured fetching session details'}
                    />
                )}
                <Panel title='Active Sessions'>
                    {isLoading ? (
                        <LoadingSpinner />
                    ) : (
                        <div className='flex flex-col gap-2'>
                            <p>
                                Below you will see the active &lsquo;sessions&rsquo; that you have
                                on the website. If you see any unexpected activity on your account,
                                remove the session and consider changing your password.
                            </p>
                            <Table isStriped aria-label='Security Table'>
                                <TableHeader>
                                    <TableColumn>IP Address</TableColumn>
                                    <TableColumn>Last Used</TableColumn>
                                    <TableColumn>Actions</TableColumn>
                                </TableHeader>
                                <TableBody
                                    emptyContent={
                                        "You have no active sessions. This shouldn't really happen."
                                    }
                                >
                                    {(sessions || []).map((session) => (
                                        <TableRow key={session.id}>
                                            <TableCell>{session.ip}</TableCell>
                                            <TableCell>
                                                {moment(session.lastUsed).format(
                                                    'YYYY-MM-DD HH:mm'
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <Link
                                                    onPress={() => setRemovingSession(session)}
                                                    isDisabled={isRemoving}
                                                >
                                                    <FontAwesomeIcon
                                                        className='text-red-700'
                                                        icon={faTimes}
                                                    />
                                                </Link>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </Panel>
            </Page>
            <ConfirmDialog
                isOpen={!!removingSession}
                message={
                    'Are you sure you want to remove this session? It will be logged out and any games in progress may be abandonded.'
                }
                onOpenChange={(open) => !open && setRemovingSession(null)}
                onCancel={() => setRemovingSession(null)}
                onOk={async () => {
                    try {
                        await removeSession({
                            username: user.username,
                            sessionId: removingSession.id
                        }).unwrap();
                        toast.success(`Session '${removingSession.ip}' removed successfully.`);
                        setRemovingSession(null);
                    } catch (err) {
                        toast.error(
                            err.message ||
                                'An error occured removing the session. Please try again later.'
                        );
                    }
                }}
            />
        </>
    );
};

export default Security;
