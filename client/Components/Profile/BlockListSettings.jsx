import React, { useState } from 'react';
import { Button, Table, Spinner } from '@heroui/react';
import { toast } from 'react-toastify';
import {
    useAddBlockListEntryMutation,
    useGetBlockListQuery,
    useRemoveBlockListEntryMutation
} from '../../redux/middleware/api';
import Field from '../Site/Field';
import LoadingSpinner from '../Site/LoadingSpinner';
import Notice from '../Site/Notice';

const BlockListSettings = ({ user }) => {
    const [username, setUsername] = useState('');
    const { data: blockList, isLoading, error } = useGetBlockListQuery(user.username);
    const [addBlockListEntry, { isLoading: isAdding }] = useAddBlockListEntryMutation();
    const [removeBlockListEntry, { isLoading: isRemoving }] = useRemoveBlockListEntryMutation();

    const onBlock = async (event) => {
        event.preventDefault();
        const blockedUsername = username.trim();
        if (!blockedUsername) {
            return;
        }

        try {
            await addBlockListEntry({ username: user.username, blockedUsername }).unwrap();
            setUsername('');
            toast.success(`${blockedUsername} blocked`);
        } catch (err) {
            toast.error(
                err.data?.message ||
                    err.message ||
                    `${blockedUsername} couldn't be blocked. Please try again later.`
            );
        }
    };

    const onUnblock = async (blockedUsername) => {
        try {
            await removeBlockListEntry({ username: user.username, blockedUsername }).unwrap();
            toast.success(`${blockedUsername} unblocked`);
        } catch (err) {
            toast.error(
                err.data?.message ||
                    err.message ||
                    `${blockedUsername} couldn't be unblocked. Please try again later.`
            );
        }
    };

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <Notice kind='error'>
                {error.data?.message || "Your block list couldn't be loaded. Try again later."}
            </Notice>
        );
    }

    return (
        <>
            <form className='flex flex-wrap items-end gap-3.5' onSubmit={onBlock}>
                <Field
                    className='min-w-0 flex-[1_1_14rem]'
                    label='Username'
                    placeholder='Player to block'
                    value={username}
                    onValueChange={setUsername}
                />
                <Button type='submit' isPending={isAdding} variant='primary'>
                    {isAdding && <Spinner color='current' size='sm' />}Block
                </Button>
            </form>
            <Table variant='secondary'>
                <Table.ScrollContainer>
                    <Table.Content aria-label='Blocked players'>
                        <Table.Header>
                            <Table.Column isRowHeader>Player</Table.Column>
                            <Table.Column>
                                <span className='sr-only'>Actions</span>
                            </Table.Column>
                        </Table.Header>
                        <Table.Body renderEmptyState={() => "You haven't blocked anyone."}>
                            {(blockList || []).map((blocked) => (
                                <Table.Row key={blocked} id={blocked}>
                                    <Table.Cell>{blocked}</Table.Cell>
                                    <Table.Cell>
                                        <Button
                                            size='sm'
                                            isDisabled={isRemoving}
                                            onPress={() => onUnblock(blocked)}
                                            variant='ghost'
                                            className='text-danger'
                                        >
                                            Unblock
                                        </Button>
                                    </Table.Cell>
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
        </>
    );
};

export default BlockListSettings;
