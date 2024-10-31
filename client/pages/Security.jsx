import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useGetUserSessionsQuery, useRemoveSessionMutation } from '../redux/middleware/api';
import { Table, TableBody, TableCell, TableColumn, TableHeader, TableRow } from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';

const Security = () => {
    const user = useSelector((state) => state.auth.user);
    const {
        data: sessions,
        isLoading,
        error
    } = useGetUserSessionsQuery(user?.username, { skip: !user });
    const [removeSession, { isLoading: isRemoving }] = useRemoveSessionMutation();

    const onRemoveClick = useCallback(
        (session) => {
            if (!user) {
                return;
            }

            toast.confirm(
                'Are you sure you want to remove this session?  It will be logged out and any games in progress may be abandonded.',
                {
                    onOk: async () => {
                        try {
                            await removeSession({
                                username: user.username,
                                sessionId: session.id
                            }).unwrap();
                            toast.success('Session removed successfully');
                        } catch (err) {
                            toast.error(
                                err.message ||
                                    'An error occured removing the session. Please try again later.'
                            );
                        }
                    }
                }
            );
        },
        [user, removeSession]
    );

    const sessionsList = useMemo(() => {
        if (!sessions) {
            return null;
        }

        return sessions.map((session) => {
            return (
                <TableRow key={session.id}>
                    <TableCell>{session.ip}</TableCell>
                    <TableCell>{moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}</TableCell>
                    <TableCell>
                        <a
                            href='#'
                            onClick={(event) => onRemoveClick(session, event)}
                            className='btn'
                            disabled={isRemoving}
                        >
                            <FontAwesomeIcon className='text-red-700' icon={faTimes} />
                        </a>
                    </TableCell>
                </TableRow>
            );
        });
    }, [isRemoving, onRemoveClick, sessions]);

    let table =
        sessions && sessions.length === 0 ? (
            <div>You have no active sessions. This shouldn&apos;t really happen.</div>
        ) : (
            <Table isStriped className='mt-2'>
                <TableHeader>
                    <TableColumn>IP Address</TableColumn>
                    <TableColumn>Last Used</TableColumn>
                    <TableColumn>Remove</TableColumn>
                </TableHeader>
                <TableBody>{sessionsList}</TableBody>
            </Table>
        );

    if (isLoading) {
        return <div>Loading session details from the server...</div>;
    }

    if (error) {
        return (
            <AlertPanel
                type='error'
                message={error.data?.message || 'An error occured fetching session details'}
            />
        );
    }

    return (
        <div className='w-2/3 mx-auto profile'>
            <Panel title='Active Sessions'>
                <p className='help-block'>
                    Below you will see the active &lsquo;sessions&rsquo; that you have on the
                    website. If you see any unexpected activity on your account, remove the session
                    and consider changing your password.
                </p>
                {table}
            </Panel>
        </div>
    );
};

export default Security;
