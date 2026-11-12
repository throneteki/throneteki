import React, { useCallback, useMemo, useState } from 'react';
import moment from 'moment';
import { Button } from '@heroui/react';
import { toast } from 'react-toastify';

import Panel from '../Components/Site/Panel';
import ReactTable from '../Components/Table/ReactTable';
import { useGetProblemReportsQuery, useLazyGetProblemReportQuery } from '../redux/middleware/api';
import { downloadBlob } from '../util';
import Page from './Page';

const SourceLabels = {
    report: 'Report a problem',
    'cancel-prompt': '/cancel-prompt'
};

const hasValue = (value) => value !== null && value !== undefined;

const ProblemReportsAdmin = () => {
    const [getProblemReport] = useLazyGetProblemReportQuery();
    const [downloadingId, setDownloadingId] = useState(null);

    const onDownloadClick = useCallback(
        async (id) => {
            setDownloadingId(id);
            try {
                const report = await getProblemReport(id).unwrap();
                const blob = new Blob([JSON.stringify(report, null, 2)], {
                    type: 'application/json'
                });

                downloadBlob(blob, `${id}.json`);
            } catch (err) {
                toast.error(err?.data?.message || 'Could not download the problem report.');
            } finally {
                setDownloadingId(null);
            }
        },
        [getProblemReport]
    );

    const columns = useMemo(
        () => [
            {
                accessorKey: 'createdAt',
                header: 'Created',
                cell: (info) => moment(info.getValue()).local().format('YYYY-MM-DD HH:mm'),
                enableColumnFilter: false,
                meta: { colWidth: '12%' }
            },
            {
                accessorKey: 'id',
                header: 'ID',
                cell: (info) => <span className='font-mono text-xs'>{info.getValue()}</span>,
                enableSorting: false,
                meta: { colWidth: '22%' }
            },
            {
                accessorKey: 'reporter',
                header: 'Reporter',
                enableSorting: false,
                meta: { colWidth: '10%' }
            },
            {
                id: 'players',
                accessorFn: (row) => (row.players || []).join(', '),
                header: 'Players',
                enableSorting: false,
                meta: { colWidth: '14%' }
            },
            {
                accessorKey: 'gameName',
                header: 'Game',
                enableSorting: false,
                meta: { colWidth: '14%' }
            },
            {
                id: 'state',
                accessorFn: (row) =>
                    [hasValue(row.round) && `Round ${row.round}`, row.phase]
                        .filter(Boolean)
                        .join(', '),
                header: 'Round / phase',
                enableColumnFilter: false,
                enableSorting: false,
                meta: { colWidth: '10%' }
            },
            {
                id: 'source',
                accessorFn: (row) => SourceLabels[row.source] || '-',
                header: 'Source',
                enableColumnFilter: false,
                enableSorting: false,
                meta: { colWidth: '10%' }
            },
            {
                id: 'download',
                header: '',
                enableColumnFilter: false,
                enableSorting: false,
                cell: (info) => (
                    <Button
                        size='sm'
                        color='primary'
                        isLoading={downloadingId === info.row.original.id}
                        onPress={() => onDownloadClick(info.row.original.id)}
                    >
                        Download
                    </Button>
                ),
                meta: { colWidth: '8%' }
            }
        ],
        [downloadingId, onDownloadClick]
    );

    return (
        <Page>
            <Panel title='Problem reports'>
                <div className='flex flex-col gap-2'>
                    <p>
                        Reports are kept for 30 days. To load one locally, download it and start a
                        game node with <code>SCENARIO=file:&lt;path to report.json&gt;</code> and{' '}
                        <code>SCENARIO_USERS</code> set to one account per player.
                    </p>
                    <div className='h-[600px]'>
                        <ReactTable
                            columns={columns}
                            dataLoadFn={useGetProblemReportsQuery}
                            defaultSort={[{ id: 'createdAt', desc: true }]}
                            disableSelection
                            remote
                        />
                    </div>
                </div>
            </Panel>
        </Page>
    );
};

export default ProblemReportsAdmin;
