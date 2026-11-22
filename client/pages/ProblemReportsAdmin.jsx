import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { Button, Checkbox, Chip, Input, Pagination } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faRefresh, faSearch, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

import LoadingSpinner from '../Components/Site/LoadingSpinner';
import AlertPanel from '../Components/Site/AlertPanel';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import {
    useDeleteProblemReportsMutation,
    useGetProblemReportsQuery,
    useGetProblemReportQuery
} from '../redux/middleware/api';
import { downloadBlob } from '../util';
import { MaxDeleteCount } from '../../shared/problemReportLimits';
import ProblemReportDetails from './ProblemReportDetails';
import Page from './Page';

const PageSize = 20;

const errorMessage = (err, fallback) => {
    if (typeof err === 'string') {
        return err;
    }

    return typeof err?.data?.message === 'string' ? err.data.message : fallback;
};
const Sorting = [{ id: 'createdAt', desc: true }];

const hasValue = (value) => value !== null && value !== undefined;

const useDebounced = (value, delay) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
        const timeout = setTimeout(() => setDebounced(value), delay);
        return () => clearTimeout(timeout);
    }, [value, delay]);

    return debounced;
};

const ReportListItem = ({ report, isSelected, isChecked, onSelect, onCheck }) => {
    const created = moment(report.createdAt).local();
    const state = [hasValue(report.round) && `Round ${report.round}`, report.phase]
        .filter(Boolean)
        .join(', ');

    return (
        <div
            role='button'
            tabIndex={0}
            onClick={onSelect}
            onKeyDown={(event) => event.key === 'Enter' && onSelect()}
            className={classNames(
                'flex gap-2 p-2 rounded-medium border-1 cursor-pointer transition-colors',
                {
                    'border-primary bg-primary/15': isSelected,
                    'border-transparent hover:bg-default/30': !isSelected
                }
            )}
        >
            <div onClick={(event) => event.stopPropagation()} className='pt-0.5'>
                <Checkbox
                    size='sm'
                    isSelected={isChecked}
                    onValueChange={onCheck}
                    aria-label='Select report'
                />
            </div>
            <div className='flex flex-col gap-1 min-w-0 flex-1'>
                {report.description ? (
                    <span className='font-semibold line-clamp-2'>{report.description}</span>
                ) : (
                    <span className='italic text-default-500'>No description</span>
                )}
                <div className='flex flex-wrap items-center gap-x-2 gap-y-1 text-tiny text-default-500'>
                    <span className='font-bold text-default-700'>{report.reporter}</span>
                    <span title={created.format('YYYY-MM-DD HH:mm:ss')}>{created.fromNow()}</span>
                    {state && (
                        <Chip size='sm' variant='bordered' className='capitalize h-5'>
                            {state}
                        </Chip>
                    )}
                    {report.source === 'cancel-prompt' && (
                        <Chip size='sm' variant='flat' color='warning' className='h-5'>
                            /cancel-prompt
                        </Chip>
                    )}
                </div>
            </div>
        </div>
    );
};

const ProblemReportsAdmin = () => {
    const [search, setSearch] = useState('');
    const [pageState, setPageState] = useState({ search: '', page: 1 });
    const [selectedId, setSelectedId] = useState(null);
    const [checked, setChecked] = useState(new Map());
    const [reportsToDelete, setReportsToDelete] = useState([]);
    const debouncedSearch = useDebounced(search.trim(), 300);
    const page = pageState.search === debouncedSearch ? pageState.page : 1;
    const setPage = useCallback(
        (newPage) => setPageState({ search: debouncedSearch, page: newPage }),
        [debouncedSearch]
    );

    useEffect(() => setChecked(new Map()), [debouncedSearch, page]);

    const {
        data: list,
        isLoading: isListLoading,
        isFetching: isListFetching,
        isError: isListError,
        refetch
    } = useGetProblemReportsQuery({
        pageIndex: page,
        pageSize: PageSize,
        sorting: Sorting,
        columnFilters: debouncedSearch ? [{ id: 'search', value: debouncedSearch }] : []
    });
    const reports = list?.data || [];
    const pageCount = Math.max(1, Math.ceil((list?.totalCount || 0) / PageSize));

    useEffect(() => {
        if (list && page > pageCount) {
            setPage(pageCount);
        }
    }, [list, page, pageCount, setPage]);

    const {
        data: report,
        isFetching: isReportFetching,
        isError: isReportError
    } = useGetProblemReportQuery(selectedId, { skip: !selectedId });
    const [deleteProblemReports, { isLoading: isDeleting }] = useDeleteProblemReportsMutation();

    const toggleChecked = useCallback((summary, isChecked) => {
        setChecked((current) => {
            const next = new Map(current);
            if (isChecked) {
                next.set(summary.id, summary);
            } else {
                next.delete(summary.id);
            }
            return next;
        });
    }, []);

    const allOnPageChecked = reports.length > 0 && reports.every((item) => checked.has(item.id));

    const onDownload = useCallback(() => {
        if (!report) {
            return;
        }

        try {
            const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
            downloadBlob(blob, `${report.id}.json`);
        } catch {
            toast.error('Could not download the problem report.');
        }
    }, [report]);

    const onConfirmDelete = useCallback(async () => {
        const ids = reportsToDelete.map((toDelete) => toDelete.id);
        const processed = [];
        let deletedCount = 0;

        try {
            for (let start = 0; start < ids.length; start += MaxDeleteCount) {
                const batch = ids.slice(start, start + MaxDeleteCount);
                const result = await deleteProblemReports(batch).unwrap();
                deletedCount += result?.ids?.length ?? 0;
                processed.push(...batch);
            }

            toast.success(
                deletedCount === 1 ? 'Report deleted' : `${deletedCount} reports deleted`
            );
            if (deletedCount < ids.length) {
                toast.info(`${ids.length - deletedCount} had already been deleted or expired`);
            }
        } catch (err) {
            toast.error(
                `${errorMessage(err, 'Could not delete the reports.')}` +
                    (deletedCount > 0 ? ` ${deletedCount} were deleted before the error.` : '')
            );
        } finally {
            if (processed.includes(selectedId)) {
                setSelectedId(null);
            }
            setChecked((current) => {
                const next = new Map(current);
                processed.forEach((id) => next.delete(id));
                return next;
            });
            setReportsToDelete([]);
        }
    }, [deleteProblemReports, reportsToDelete, selectedId]);

    return (
        <Page size='wide'>
            <div className='flex flex-col lg:flex-row gap-3 lg:h-[calc(100vh-7rem)]'>
                <aside className='lg:w-[380px] shrink-0 flex flex-col gap-2 bg-zinc-950/95 backdrop-blur-md shadow-lg border-1 border-default-200 rounded-large p-3 min-h-0 max-lg:max-h-[60vh]'>
                    <div className='flex items-center justify-between gap-2'>
                        <div>
                            <h2 className='font-bold text-large'>Problem reports</h2>
                            <p className='text-tiny text-default-500'>
                                {list ? `${list.totalCount} reports · ` : ''}kept for 30 days
                            </p>
                        </div>
                        <Button
                            size='sm'
                            variant='light'
                            isIconOnly
                            aria-label='Refresh'
                            isLoading={isListFetching}
                            onPress={() => refetch()}
                        >
                            <FontAwesomeIcon icon={faRefresh} />
                        </Button>
                    </div>
                    <Input
                        size='sm'
                        placeholder='Search reports'
                        startContent={<FontAwesomeIcon icon={faSearch} />}
                        value={search}
                        onValueChange={setSearch}
                        isClearable
                        onClear={() => setSearch('')}
                    />
                    <div className='flex items-center justify-between gap-2 min-h-8'>
                        <Checkbox
                            size='sm'
                            isSelected={allOnPageChecked}
                            isDisabled={reports.length === 0}
                            onValueChange={(isChecked) =>
                                reports.forEach((item) => toggleChecked(item, isChecked))
                            }
                        >
                            <span className='text-small'>Select page</span>
                        </Checkbox>
                        {checked.size > 0 && (
                            <Button
                                size='sm'
                                color='danger'
                                variant='flat'
                                startContent={<FontAwesomeIcon icon={faTrashAlt} />}
                                isLoading={isDeleting}
                                onPress={() => setReportsToDelete([...checked.values()])}
                            >
                                Delete {checked.size}
                            </Button>
                        )}
                    </div>
                    <div className='flex-1 min-h-0 overflow-y-auto flex flex-col gap-1 -mx-1 px-1'>
                        {isListLoading && <LoadingSpinner />}
                        {isListError && (
                            <AlertPanel variant='danger' message='Could not load the reports.' />
                        )}
                        {!isListLoading && !isListError && reports.length === 0 && (
                            <p className='text-default-500 text-small p-2'>
                                {debouncedSearch ? 'No reports match' : 'No problem reports'}
                            </p>
                        )}
                        {reports.map((item) => (
                            <ReportListItem
                                key={item.id}
                                report={item}
                                isSelected={item.id === selectedId}
                                isChecked={checked.has(item.id)}
                                onSelect={() => setSelectedId(item.id)}
                                onCheck={(isChecked) => toggleChecked(item, isChecked)}
                            />
                        ))}
                    </div>
                    {pageCount > 1 && (
                        <Pagination
                            size='sm'
                            className='self-center'
                            total={pageCount}
                            page={page}
                            onChange={setPage}
                            showControls
                        />
                    )}
                </aside>

                <main className='flex-1 min-w-0 min-h-0 bg-zinc-950/95 backdrop-blur-md shadow-lg border-1 border-default-200 rounded-large p-4 flex flex-col'>
                    {!selectedId && (
                        <div className='flex-1 flex items-center justify-center text-default-500'>
                            Select a report to see what went wrong
                        </div>
                    )}
                    {selectedId && isReportFetching && <LoadingSpinner label='Loading report...' />}
                    {selectedId && isReportError && !isReportFetching && (
                        <AlertPanel variant='danger' message='Could not load the problem report.' />
                    )}
                    {selectedId && report && !isReportFetching && (
                        <ProblemReportDetails
                            report={report}
                            onDownload={onDownload}
                            onDelete={() => setReportsToDelete([report])}
                        />
                    )}
                </main>
            </div>

            <ConfirmDialog
                isOpen={reportsToDelete.length > 0}
                onOpenChange={(open) => !open && setReportsToDelete([])}
                title={
                    reportsToDelete.length === 1
                        ? 'Delete this problem report?'
                        : `Delete these ${reportsToDelete.length} problem reports?`
                }
                message={
                    <div className='flex flex-col gap-2'>
                        <ul className='flex flex-col gap-1 text-small max-h-64 overflow-y-auto'>
                            {reportsToDelete.map((toDelete) => (
                                <li key={toDelete.id}>
                                    <span className='font-bold'>{toDelete.reporter}</span>,{' '}
                                    {moment(toDelete.createdAt).local().format('YYYY-MM-DD HH:mm')}
                                    {': '}
                                    <span className='text-default-500'>
                                        {toDelete.description || 'No description'}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <p>This can&apos;t be undone.</p>
                    </div>
                }
                onOk={onConfirmDelete}
            />
        </Page>
    );
};

export default ProblemReportsAdmin;
