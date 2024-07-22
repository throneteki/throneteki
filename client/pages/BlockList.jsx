import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import Input from '../Components/Form/Input';
import {
    useAddBlockListEntryMutation,
    useGetBlockListQuery,
    useRemoveBlockListEntryMutation
} from '../redux/middleware/api';
import { toastr } from 'react-redux-toastr';

const BlockList = () => {
    const user = useSelector((state) => state.auth.user);

    const [username, setUsername] = useState('');
    const {
        data: blockList,
        isLoading,
        error
    } = useGetBlockListQuery(user?.username, { skip: !user });
    const [addBlockListEntry, { isLoading: isAddLoading }] = useAddBlockListEntryMutation();
    const [removeBlockListEntry, { isLoading: isRemoving }] = useRemoveBlockListEntryMutation();

    const onUsernameChange = useCallback((event) => {
        setUsername(event.target.value);
    }, []);

    const onAddClick = useCallback(
        async (event) => {
            try {
                event.preventDefault();
                await addBlockListEntry({
                    username: user.username,
                    blockedUsername: username
                }).unwrap();
                toastr.success('Blocklist entry added successfully');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error(
                    err.message ||
                        'An error occured adding the blocklist entry. Please try again later.'
                );
            }
        },
        [addBlockListEntry, user?.username, username]
    );

    const onRemoveClick = useCallback(
        async (username) => {
            try {
                await removeBlockListEntry({
                    username: user.username,
                    blockedUsername: username
                }).unwrap();
                toastr.success('Blocklist entry removed successfully');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error(
                    err.message ||
                        'An error occured removing the blocklist entry. Please try again later.'
                );
            }
        },
        [removeBlockListEntry, user?.username]
    );

    const retBlocklist = useMemo(
        () =>
            blockList
                ? blockList.map((user) => {
                      return (
                          <tr key={user}>
                              <td>{user}</td>
                              <td>
                                  <a href='#' className='btn' onClick={() => onRemoveClick(user)}>
                                      <span className='glyphicon glyphicon-remove' />
                                  </a>
                              </td>
                          </tr>
                      );
                  })
                : null,
        [blockList, onRemoveClick]
    );

    const table = useMemo(
        () =>
            blockList && blockList.length === 0 ? (
                <div>No users currently blocked</div>
            ) : (
                <table className='table table-striped blocklist'>
                    <thead>
                        <tr>
                            <th>Username</th>
                            <th>Remove</th>
                        </tr>
                    </thead>
                    <tbody>{retBlocklist}</tbody>
                </table>
            ),
        [blockList, retBlocklist]
    );

    if (isLoading) {
        return <div>Loading block list from the server...</div>;
    }

    if (error) {
        return (
            <AlertPanel
                type='error'
                message={error.message || 'An error occured loading the block list'}
            />
        );
    }

    return (
        <div className='col-sm-8 col-sm-offset-2 full-height'>
            <div className='about-container'>
                <form className='form form-horizontal'>
                    <Panel title='Block list'>
                        <p>
                            It can sometimes become necessary to prevent someone joining your games,
                            or stop seeing their messages, or both. Users on this list will not be
                            able to join your games, and you will not see their chat messages or
                            their games.
                        </p>

                        <div className='form-group'>
                            <Input
                                name='blockee'
                                label='Username'
                                labelClass='col-sm-4'
                                fieldClass='col-sm-4'
                                placeholder='Enter username to block'
                                type='text'
                                onChange={onUsernameChange}
                                value={username}
                                noGroup
                            />
                            <button className='btn btn-primary col-sm-1' onClick={onAddClick}>
                                Add {isAddLoading && <span className='spinner button-spinner' />}
                            </button>
                        </div>

                        <h3>Users Blocked</h3>
                        {table}
                    </Panel>
                </form>
            </div>
        </div>
    );
};

export default BlockList;
