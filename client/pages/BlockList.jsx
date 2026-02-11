import React, { useState, useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import AlertPanel from '../Components/Site/AlertPanel';
import Panel from '../Components/Site/Panel';
import {
    useAddBlockListEntryMutation,
    useGetBlockListQuery,
    useRemoveBlockListEntryMutation
} from '../redux/middleware/api';
import {
    Button,
    Input,
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
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Page from './Page';

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

    const onAddClick = useCallback(async () => {
        try {
            await addBlockListEntry({
                username: user.username,
                blockedUsername: username.trim()
            }).unwrap();
            setUsername('');
            toast.success(`Successfully added ${username.trim()} to block list`);
        } catch (err) {
            toast.error(
                err.message ||
                    `An error occured adding ${username} to blocked list. Please try again later.`
            );
        }
    }, [addBlockListEntry, user?.username, username]);

    const onRemoveClick = useCallback(
        async (username) => {
            try {
                await removeBlockListEntry({
                    username: user.username,
                    blockedUsername: username
                }).unwrap();
                toast.success(`Successfully removed ${username} from blocked list`);
            } catch (err) {
                toast.error(
                    err.message ||
                        `An error occured removing ${username} from blocked list. Please try again later.`
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
                                  <Button
                                      isIconOnly
                                      size='sm'
                                      startContent={
                                          <FontAwesomeIcon
                                              className='text-red-700'
                                              icon={faTimes}
                                          />
                                      }
                                      onPress={() => onRemoveClick(user)}
                                      isLoading={isRemoving}
                                  />
                              </TableCell>
                          </TableRow>
                      );
                  })
                : null,
        [blockList, isRemoving, onRemoveClick]
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <AlertPanel variant='danger'>
                {error.message || 'An error occured loading the block list'}
            </AlertPanel>
        );
    }

    return (
        <Page>
            <Panel title='Block list'>
                <div className='flex flex-col gap-2'>
                    <p>
                        It can sometimes become necessary to prevent someone joining your games, or
                        stop seeing their messages, or both. Users on this list will not be able to
                        join your games, and you will not see their chat messages or their games.
                    </p>
                    <Input
                        className='lg:w-1/3'
                        label='Username'
                        placeholder='Enter username to block'
                        type='text'
                        onValueChange={setUsername}
                        value={username}
                    />
                    <Button
                        className={'sm:self-start'}
                        isLoading={isAddLoading}
                        color='primary'
                        onPress={onAddClick}
                    >
                        Add
                    </Button>
                    <div>
                        <h3 className='font-bold pb-2'>Users Blocked</h3>
                        {
                            <Table isStriped aria-label='Block List Table'>
                                <TableHeader>
                                    <TableColumn>Username</TableColumn>
                                    <TableColumn>Actions</TableColumn>
                                </TableHeader>
                                <TableBody emptyContent={'No users currently blocked'}>
                                    {retBlocklist}
                                </TableBody>
                            </Table>
                        }
                    </div>
                </div>
            </Panel>
        </Page>
    );
};

export default BlockList;
