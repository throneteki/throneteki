import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import {
    useAddBlockListEntryMutation,
    useGetBlockListQuery,
    useRemoveBlockListEntryMutation
} from '../redux/middleware/api';
import { toastr } from 'react-redux-toastr';
import {
    Button,
    Input,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

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
                          <TableRow key={user}>
                              <TableCell>{user}</TableCell>
                              <TableCell>
                                  <a href='#' className='btn' onClick={() => onRemoveClick(user)}>
                                      <FontAwesomeIcon className='text-red-700' icon={faTimes} />
                                  </a>
                              </TableCell>
                          </TableRow>
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
                <Table isStriped>
                    <TableHeader>
                        <TableColumn>Username</TableColumn>
                        <TableColumn>Remove</TableColumn>
                    </TableHeader>
                    <TableBody>{retBlocklist}</TableBody>
                </Table>
            ),
        [blockList, retBlocklist]
    );

    if (isLoading) {
        return <div>Loading block list from the server...</div>;
    }

    if (error) {
        return (
            <AlertPanel
                variant='danger'
                message={error.message || 'An error occured loading the block list'}
            />
        );
    }

    return (
        <div className='w-2/3 mx-auto'>
            <div>
                <Panel title='Block list'>
                    <p>
                        It can sometimes become necessary to prevent someone joining your games, or
                        stop seeing their messages, or both. Users on this list will not be able to
                        join your games, and you will not see their chat messages or their games.
                    </p>

                    <div className='mt-2'>
                        <Input
                            className='w-1/3'
                            name='blockee'
                            label='Username'
                            placeholder='Enter username to block'
                            type='text'
                            onChange={onUsernameChange}
                            value={username}
                        />
                        <Button
                            isLoading={isAddLoading}
                            className='mt-2'
                            color='primary'
                            onClick={onAddClick}
                        >
                            Add
                        </Button>

                        <div className='mt-2'>
                            <h3 className='font-bold'>Users Blocked</h3>
                            {table}
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default BlockList;
