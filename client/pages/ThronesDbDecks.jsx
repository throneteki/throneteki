import React, { useMemo, useState } from 'react';
import moment from 'moment';
import { Button } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCircleCheck,
    faCloudArrowDown,
    faDownload,
    faRightLeft
} from '@fortawesome/free-solid-svg-icons';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';

import Page from './Page';
import Frame from '../Components/Site/Frame';
import Notice from '../Components/Site/Notice';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import ReactTable from '../Components/Table/ReactTable';
import {
    useGetThronesDbAuthorizeUrlMutation,
    useGetThronesDbDecksQuery,
    useGetThronesDbStatusQuery,
    useImportThronesDbDecksMutation,
    useSyncThronesDbDecksMutation,
    useUnlinkThronesDbMutation
} from '../redux/middleware/api';
import { getOAuthState, ThronesDbStateKey } from '../util';
import { navigate } from '../redux/reducers/navigation';

const useThronesDbDecks = () => {
    const result = useGetThronesDbDecksQuery();

    return { ...result, data: result.data && { data: result.data } };
};

function importedMessage({ created, updated, skipped, locked, unknownCards, failed }) {
    const parts = [];
    if (created > 0 || updated === 0) {
        parts.push(`${created} imported`);
    }

    if (updated > 0) {
        parts.push(`${updated} updated`);
    }

    if (skipped > 0) {
        parts.push(`${skipped} skipped because they were already imported`);
    }

    if (locked > 0) {
        parts.push(`${locked} skipped because they are registered for an event`);
    }

    if (unknownCards > 0) {
        parts.push(`${unknownCards} skipped because they contain cards not available here yet`);
    }

    if (failed > 0) {
        parts.push(`${failed} could not be saved`);
    }

    return parts.join(', ');
}

const LinkAccount = ({ needsRelink }) => {
    const [getAuthorizeUrl, { isLoading }] = useGetThronesDbAuthorizeUrlMutation();

    const onLinkClick = async () => {
        const state = getOAuthState(ThronesDbStateKey);
        if (!state) {
            toast.error('Your browser does not allow linking accounts from this page');
            return;
        }

        try {
            window.location.assign(await getAuthorizeUrl(state).unwrap());
        } catch (err) {
            toast.error(err || 'An error occured linking your account. Please try again later.');
        }
    };

    return (
        <div className='flex flex-col items-start gap-4'>
            <p className='max-w-prose text-ink-dim'>
                {needsRelink
                    ? 'Your ThronesDB link has expired. Link your account again to import decks.'
                    : 'Link your ThronesDB account to import your decks from there, and keep them up to date.'}
            </p>
            <Button variant='primary' isPending={isLoading} onPress={onLinkClick}>
                Link ThronesDB account
            </Button>
        </div>
    );
};

const DeckTable = () => {
    const { data: decks, isLoading, error } = useGetThronesDbDecksQuery();
    const [importDecks, { isLoading: isImportLoading }] = useImportThronesDbDecksMutation();
    const [syncDecks, { isLoading: isSyncLoading }] = useSyncThronesDbDecksMutation();
    const [unlink, { isLoading: isUnlinkLoading }] = useUnlinkThronesDbMutation();
    const [selectedRows, setSelectedRows] = useState([]);

    const columns = useMemo(
        () => [
            { accessorKey: 'name', header: 'Name', meta: { colWidth: '45%' } },
            { accessorKey: 'factionName', header: 'Faction', meta: { colWidth: '20%' } },
            {
                accessorKey: 'dateUpdate',
                header: 'Updated',
                cell: (info) => moment(info.getValue()).local().format('YYYY-MM-DD HH:mm'),
                meta: { colWidth: '20%', className: 'max-sm:hidden' },
                enableColumnFilter: false
            },
            {
                accessorKey: 'isImported',
                header: 'Imported',
                cell: (info) =>
                    info.getValue() ? (
                        <div className='text-center text-success'>
                            <FontAwesomeIcon icon={faCircleCheck} />
                        </div>
                    ) : null,
                meta: { colWidth: '15%' },
                enableColumnFilter: false,
                enableSorting: false
            }
        ],
        []
    );

    const runImport = async (action) => {
        try {
            toast.success(importedMessage(await action().unwrap()));
        } catch (err) {
            toast.error(err || 'An error occured importing decks. Please try again later.');
        }
    };

    if (isLoading) {
        return <LoadingSpinner label='Loading your ThronesDB decks...' />;
    }

    if (error) {
        return <Notice kind='error'>{error}</Notice>;
    }

    const newDeckIds = (decks || []).filter((deck) => !deck.isImported).map((deck) => deck.id);

    const buttons = [
        {
            color: 'default',
            icon: <FontAwesomeIcon icon={faDownload} />,
            label: 'Import selected',
            disabled: selectedRows.length === 0,
            isLoading: isImportLoading,
            onPress: () => runImport(() => importDecks(selectedRows))
        },
        {
            color: 'default',
            icon: <FontAwesomeIcon icon={faCloudArrowDown} />,
            label: 'Import all new',
            disabled: newDeckIds.length === 0,
            isLoading: isImportLoading,
            onPress: () => runImport(() => importDecks(newDeckIds))
        },
        {
            color: 'default',
            icon: <FontAwesomeIcon icon={faRightLeft} />,
            label: 'Sync imported',
            disabled: !decks?.some((deck) => deck.isImported),
            isLoading: isSyncLoading,
            onPress: () => runImport(() => syncDecks())
        },
        {
            color: 'danger',
            label: 'Unlink',
            isLoading: isUnlinkLoading,
            onPress: async () => {
                try {
                    await unlink().unwrap();
                    toast.success('Your ThronesDB account was unlinked');
                } catch (err) {
                    toast.error(err || 'An error occured unlinking your account.');
                }
            }
        }
    ];

    return (
        <ReactTable
            buttons={buttons}
            dataLoadFn={useThronesDbDecks}
            columns={columns}
            defaultSort={[{ id: 'dateUpdate', desc: true }]}
            emptyContent='There are no decks in your ThronesDB account to import.'
            onRowSelectionChange={(rows) => setSelectedRows(rows.map((row) => row.original.id))}
        />
    );
};

const ThronesDbDecks = () => {
    const dispatch = useDispatch();
    const { data: status, isLoading, error } = useGetThronesDbStatusQuery();

    let content;
    if (isLoading) {
        content = <LoadingSpinner label='Checking your ThronesDB link...' />;
    } else if (error) {
        content = <Notice kind='error'>{error}</Notice>;
    } else if (!status.configured) {
        content = (
            <Notice kind='info'>Importing from ThronesDB is not available at the moment.</Notice>
        );
    } else if (!status.linked || status.needsRelink) {
        content = <LinkAccount needsRelink={status.needsRelink} />;
    } else {
        content = (
            <div className='flex flex-col gap-5'>
                <p className='max-w-prose text-sm text-ink-dim'>
                    Importing only adds decks you have not imported yet. Imported decks stay linked
                    to ThronesDB, and Sync imported updates them with any changes made there,
                    replacing changes made here.
                </p>
                <DeckTable />
            </div>
        );
    }

    return (
        <Page size='wide'>
            <Frame
                title='Import from ThronesDB'
                description='Bring your ThronesDB decks here and keep them up to date.'
                actions={
                    <Button variant='tertiary' onPress={() => dispatch(navigate('/decks'))}>
                        Back to decks
                    </Button>
                }
            >
                {content}
            </Frame>
        </Page>
    );
};

export default ThronesDbDecks;
