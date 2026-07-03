import React, { useCallback, useMemo, useState } from 'react';
import moment from 'moment';

import Panel from '../Components/Site/Panel';
import {
    useAddAbuseBlockMutation,
    useGetAbuseBlocksQuery,
    useRemoveAbuseBlockMutation
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
import Page from './Page';

const BanlistAdmin = () => {
    const { data: abuseBlocks, isLoading } = useGetAbuseBlocksQuery();
    const [addAbuseBlock, { isLoading: isAddLoading }] = useAddAbuseBlockMutation();
    const [removeAbuseBlock, { isLoading: isRemoveLoading }] = useRemoveAbuseBlockMutation();
    const [scope, setScope] = useState('ip');
    const [value, setValue] = useState('');
    const [reason, setReason] = useState('');

    const onAddBanlistClick = useCallback(async () => {
        try {
            await addAbuseBlock({ scope, value, reason }).unwrap();

            toast.success('Abuse block added successfully.');
            setValue('');
            setReason('');
        } catch (err) {
            toast.error(
                err.data?.message ||
                    'An error occured adding the abuse block. Please try again later.'
            );
        }
    }, [addAbuseBlock, reason, scope, value]);

    const onDeleteBanlistClick = useCallback(
        async (id) => {
            try {
                await removeAbuseBlock(id).unwrap();

                toast.success('Abuse block deactivated successfully.');
            } catch (err) {
                toast.error(
                    err.data?.message ||
                        'An error occured deactivating the abuse block. Please try again later.'
                );
            }
        },
        [removeAbuseBlock]
    );

    const renderedBanlist = useMemo(
        () =>
            abuseBlocks &&
            abuseBlocks.map((ban) => {
                return (
                    <TableRow key={ban._id}>
                        <TableCell>{ban.scope}</TableCell>
                        <TableCell>{ban.value || ban.ip}</TableCell>
                        <TableCell>{ban.reason || '-'}</TableCell>
                        <TableCell>
                            {moment(ban.createdAt || ban.added).format('YYYY-MM-DD')}
                        </TableCell>
                        <TableCell>{ban.createdBy || ban.user}</TableCell>
                        <TableCell>
                            {ban.expiresAt ? moment(ban.expiresAt).format('YYYY-MM-DD') : 'Never'}
                        </TableCell>
                        <TableCell>{ban.active === false ? 'Inactive' : 'Active'}</TableCell>
                        <TableCell>
                            <Button
                                isLoading={isRemoveLoading}
                                color='danger'
                                isDisabled={ban.active === false}
                                onPress={() => onDeleteBanlistClick(ban._id)}
                            >
                                Deactivate
                            </Button>
                        </TableCell>
                    </TableRow>
                );
            }),
        [abuseBlocks, isRemoveLoading, onDeleteBanlistClick]
    );

    if (isLoading) {
        return <LoadingSpinner label={'Loading abuse blocks...'}></LoadingSpinner>;
    }

    return (
        <Page>
            <Panel title='Abuse block administration'>
                <Table isStriped aria-label='Ban List Table'>
                    <TableHeader>
                        <TableColumn>Scope</TableColumn>
                        <TableColumn>Value</TableColumn>
                        <TableColumn>Reason</TableColumn>
                        <TableColumn>Added</TableColumn>
                        <TableColumn>Added By</TableColumn>
                        <TableColumn>Expires</TableColumn>
                        <TableColumn>Status</TableColumn>
                        <TableColumn className='col-sm-2'>Action</TableColumn>
                    </TableHeader>
                    <TableBody>{renderedBanlist}</TableBody>
                </Table>
            </Panel>
            <Panel title='Add new abuse block'>
                <div className='flex flex-col md:flex-row gap-2 items-center'>
                    <select
                        className='border rounded-medium p-3 w-full md:w-auto'
                        value={scope}
                        onChange={(event) => setScope(event.target.value)}
                    >
                        <option value='ip'>Exact IP</option>
                        <option value='subnet'>Subnet</option>
                        <option value='fingerprint'>Fingerprint</option>
                        <option value='email_domain'>Email Domain</option>
                    </select>
                    <Input label='Value' value={value} onValueChange={setValue} />
                    <Input label='Reason' value={reason} onValueChange={setReason} />
                    <Button
                        isLoading={isAddLoading}
                        className='max-md:self-start'
                        color='primary'
                        isDisabled={!value}
                        onPress={onAddBanlistClick}
                    >
                        Add
                    </Button>
                </div>
            </Panel>
        </Page>
    );
};

export default BanlistAdmin;
