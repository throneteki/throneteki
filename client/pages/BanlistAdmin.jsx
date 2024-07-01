import React, { useCallback, useMemo } from 'react';
import moment from 'moment';

import Panel from '../Components/Site/Panel';
import Form from '../Components/Form/Form';
import {
    useAddBanListEntryMutation,
    useGetBanListQuery,
    useRemoveBanListEntryMutation
} from '../redux/middleware/api';
import { toastr } from 'react-redux-toastr';

const BanlistAdmin = () => {
    const { data: banList, isLoading, error } = useGetBanListQuery();
    const [addBanListEntry, { isLoading: isAddLoading }] = useAddBanListEntryMutation();
    const [removeBanListEntry, { isLoading: isRemoveLoading }] = useRemoveBanListEntryMutation();

    const onAddBanlistClick = useCallback(
        async (state) => {
            try {
                console.info(state, state.ip);
                await addBanListEntry(state.ip).unwrap();

                toastr.success('Ban list entry added successfully.');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error(
                    err.data?.message ||
                        'An error occured adding the ban list entry. Please try again later.'
                );
            }
        },
        [addBanListEntry]
    );

    const onDeleteBanlistClick = useCallback(
        async (id) => {
            try {
                await removeBanListEntry(id).unwrap();

                toastr.success('Ban list entry deleted successfully.');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error(
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
                    <tr key={ban._id}>
                        <td>{ban.ip}</td>
                        <td>{moment(ban.added).format('YYYY-MM-DD')}</td>
                        <td>{ban.addedBy}</td>
                        <td>
                            <button
                                className='btn btn-danger'
                                onClick={() => onDeleteBanlistClick(ban._id)}
                            >
                                Delete{' '}
                                {isRemoveLoading && <span className='spinner button-spinner' />}
                            </button>
                        </td>
                    </tr>
                );
            }),
        [banList, isRemoveLoading, onDeleteBanlistClick]
    );

    if (isLoading) {
        return 'Loading banlist, please wait...';
    }

    return (
        <div className='col-xs-12'>
            <Panel title='Banlist administration'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className='col-sm-2'>Ip</th>
                            <th className='col-sm-2'>Added</th>
                            <th className='col-sm-3'>Added By</th>
                            <th className='col-sm-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>{renderedBanlist}</tbody>
                </table>
            </Panel>
            <Panel title='Add new ip'>
                <Form
                    name='banlistAdmin'
                    apiLoading={isAddLoading}
                    buttonClass='col-sm-offset-2 col-sm-4'
                    buttonText='Add'
                    onSubmit={onAddBanlistClick}
                />
            </Panel>
        </div>
    );
};

export default BanlistAdmin;
