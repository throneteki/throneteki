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
                                onClick={() => onDeleteBanlistClick(ban._id)}
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
        return <LoadingSpinner className='p-10' label={'Loading banlist...'}></LoadingSpinner>;
    }

    return (
        <div className='w-2/3 mx-auto'>
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
            <div className='mt-2'>
                <Panel title='Add new ip'>
                    <div>
                        <Input
                            label='Add ip address'
                            value={banListText}
                            onValueChange={setBanListText}
                        />
                        <div className='mt-2'>
                            <Button
                                isLoading={isAddLoading}
                                color='primary'
                                onClick={onAddBanlistClick}
                            >
                                Add
                            </Button>
                        </div>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default BanlistAdmin;
