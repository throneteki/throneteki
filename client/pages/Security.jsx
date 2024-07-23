import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { toastr } from 'react-redux-toastr';

import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import { useGetUserSessionsQuery, useRemoveSessionMutation } from '../redux/middleware/api';

const Security = () => {
    const user = useSelector((state) => state.auth.user);
    const {
        data: sessions,
        isLoading,
        error
    } = useGetUserSessionsQuery(user?.username, { skip: !user });
    const [removeSession, { isLoading: isRemoving }] = useRemoveSessionMutation();

    const onRemoveClick = useCallback(
        (session, event) => {
            event.preventDefault();

            if (!user) {
                return;
            }

            toastr.confirm(
                'Are you sure you want to remove this session?  It will be logged out and any games in progress may be abandonded.',
                {
                    onOk: async () => {
                        try {
                            await removeSession({
                                username: user.username,
                                sessionId: session.id
                            }).unwrap();
                            toastr.success('Session removed successfully');

                            setTimeout(() => {
                                toastr.clean();
                            }, 5000);
                        } catch (err) {
                            toastr.error(
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
                <tr key={session.id}>
                    <td>{session.ip}</td>
                    <td>{moment(session.lastUsed).format('YYYY-MM-DD HH:mm')}</td>
                    <td>
                        <a
                            href='#'
                            onClick={(event) => onRemoveClick(session, event)}
                            className='btn'
                            disabled={isRemoving}
                        >
                            <span className='glyphicon glyphicon-remove' />
                        </a>
                    </td>
                </tr>
            );
        });
    }, [isRemoving, onRemoveClick, sessions]);

    let table =
        sessions && sessions.length === 0 ? (
            <div>You have no active sessions. This shouldn&apos;t really happen.</div>
        ) : (
            <table className='table table-striped'>
                <thead>
                    <tr>
                        <th>IP Address</th>
                        <th>Last Used</th>
                        <th>Remove</th>
                    </tr>
                </thead>
                <tbody>{sessionsList}</tbody>
            </table>
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
        <div className='col-sm-8 col-sm-offset-2 profile full-height'>
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
