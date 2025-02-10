import React, { useCallback, useMemo, useState } from 'react';
import moment from 'moment';

import Panel from '../Components/Site/Panel';
import {
    useAddBanListEntryMutation,
    useGetBanListQuery,
    useRemoveBanListEntryMutation
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
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import { toast } from 'react-toastify';

const BanlistAdmin = () => {
    const { data: banList, isLoading } = useGetBanListQuery();
    const [addBanListEntry, { isLoading: isAddLoading }] = useAddBanListEntryMutation();
    const [removeBanListEntry, { isLoading: isRemoveLoading }] = useRemoveBanListEntryMutation();
    const [banListText, setBanListText] = useState('');

    const onAddBanlistClick = useCallback(async () => {
        try {
            await addBanListEntry(banListText).unwrap();

            toast.success('Ban list entry added successfully.');
        } catch (err) {
            toast.error(
                err.data?.message ||
                    'An error occured adding the ban list entry. Please try again later.'
            );
        }
    }, [addBanListEntry, banListText]);

    const onDeleteBanlistClick = useCallback(
        async (id) => {
            try {
                await removeBanListEntry(id).unwrap();

                toast.success('Ban list entry deleted successfully.');
            } catch (err) {
                toast.error(
                    err.data?.message ||
                        'An error occured deleting the ban list entry. Please try again later.'
                );
            }
        },
        [removeBanListEntry]
    );

    const renderedBanlist = useMemo(
        () =>
            banList &&
            banList.map((ban) => {
                return (
                    <TableRow key={ban._id}>
                        <TableCell>{ban.ip}</TableCell>
                        <TableCell>{moment(ban.added).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{ban.addedBy}</TableCell>
                        <TableCell>
                            <Button
                                isLoading={isRemoveLoading}
                                color='danger'
                                onPress={() => onDeleteBanlistClick(ban._id)}
                            >
                                Delete
                            </Button>
                        </TableCell>
                    </TableRow>
                );
            }),
        [banList, isRemoveLoading, onDeleteBanlistClick]
    );

    if (isLoading) {
        return <LoadingSpinner label={'Loading banlist...'}></LoadingSpinner>;
    }

    return (
        <div className='m-2 lg:mx-auto lg:w-4/5 flex flex-col gap-2'>
            <Panel title='Banlist administration'>
                <Table isStriped>
                    <TableHeader>
                        <TableColumn className='col-sm-2'>Ip</TableColumn>
                        <TableColumn className='col-sm-2'>Added</TableColumn>
                        <TableColumn className='col-sm-3'>Added By</TableColumn>
                        <TableColumn className='col-sm-2'>Action</TableColumn>
                    </TableHeader>
                    <TableBody>{renderedBanlist}</TableBody>
                </Table>
            </Panel>
            <Panel title='Add new ip'>
                <div className='flex flex-col md:flex-row gap-2 items-center'>
                    <Input
                        label='Add ip address'
                        value={banListText}
                        onValueChange={setBanListText}
                    />
                    <Button
                        isLoading={isAddLoading}
                        className='max-md:self-start'
                        color='primary'
                        onPress={onAddBanlistClick}
                    >
                        Add
                    </Button>
                </div>
            </Panel>
        </div>
    );
};

export default BanlistAdmin;
