import React, { useCallback, useEffect, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { toast } from 'react-toastify';
import { Button, Checkbox, Spinner } from '@heroui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faRotateRight, faSearch } from '@fortawesome/free-solid-svg-icons';

import ConfirmDialog from '../Components/Site/ConfirmDialog';
import Field from '../Components/Site/Field';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Notice from '../Components/Site/Notice';
import Pager from '../Components/Site/Pager';
import Tag from '../Components/Site/Tag';
import {
    useDeleteProblemReportsMutation,
    useGetProblemReportsQuery,
    useGetProblemReportQuery
} from '../redux/middleware/api';
import { downloadBlob } from '../util';
import { MaxDeleteCount } from '../../shared/problemReportLimits';
import AdminPage from './AdminPage';
import ProblemReportDetails from './ProblemReportDetails';

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
        <li
            className={classNames(
                'flex gap-3 border-b border-gold-hair px-2 py-2.5 transition-colors',
                isSelected ? 'bg-gold/[0.08]' : 'hover:bg-white/[0.03]'
            )}
        >
            <Checkbox
                isSelected={isChecked}
                onChange={onCheck}
                aria-label='Select report'
                className='pt-0.5'
            >
                <Checkbox.Content>
                    <Checkbox.Control>
                        <Checkbox.Indicator />
                    </Checkbox.Control>
                </Checkbox.Content>
            </Checkbox>
            <button
                type='button'
                onClick={onSelect}
                aria-current={isSelected || undefined}
                className='flex min-w-0 flex-1 flex-col gap-1 text-left'
            >
                {report.description ? (
                    <span className='line-clamp-2 text-sm text-ink'>{report.description}</span>
                ) : (
                    <span className='text-sm text-ink-faint'>
                        {report.source === 'cancel-prompt'
                            ? 'Sent by /cancel-prompt'
                            : 'No description'}
                    </span>
                )}
                <span className='flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-ink-faint'>
                    <span className='text-ink-dim'>{report.reporter}</span>
                    <span title={created.format('D MMM YYYY, H:mm:ss')}>{created.fromNow()}</span>
                    {state && <span className='first-letter:uppercase'>{state}</span>}
                    {report.source === 'cancel-prompt' && report.description && (
                        <Tag tone='warning'>/cancel-prompt</Tag>
                    )}
                </span>
            </button>
        </li>
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
                for (const id of processed) {
                    next.delete(id);
                }
                return next;
            });
            setReportsToDelete([]);
        }
    }, [deleteProblemReports, reportsToDelete, selectedId]);

    let detail;
    if (!selectedId) {
        detail = (
            <div className='flex flex-1 items-center justify-center py-16 text-sm text-ink-faint'>
                Choose a report to see the game state when it was sent.
            </div>
        );
    } else if (isReportFetching) {
        detail = <LoadingSpinner className='py-16' />;
    } else if (isReportError || !report) {
        detail = (
            <Notice kind='error'>The report couldn&apos;t be loaded. It may have expired.</Notice>
        );
    } else {
        detail = (
            <ProblemReportDetails
                report={report}
                onDownload={onDownload}
                onDelete={() => setReportsToDelete([report])}
            />
        );
    }

    return (
        <AdminPage
            section='reports'
            title='Problem reports'
            description={`${list ? `${list.totalCount} ${list.totalCount === 1 ? 'report' : 'reports'}, kept` : 'Kept'} for 30 days. Players send these with Report a problem in a game, and /cancel-prompt sends one before it clears a stuck prompt.`}
            actions={
                <Button variant='tertiary' isPending={isListFetching} onPress={() => refetch()}>
                    {isListFetching ? (
                        <Spinner color='current' size='sm' />
                    ) : (
                        <FontAwesomeIcon icon={faRotateRight} />
                    )}
                    Refresh
                </Button>
            }
        >
            <div className='grid grid-cols-1 gap-6 lg:h-[calc(100dvh-12rem)] lg:min-h-[36rem] lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]'>
                <section
                    aria-label='Reports'
                    className={classNames(
                        'flex min-h-0 flex-col gap-3',
                        selectedId && 'max-lg:hidden'
                    )}
                >
                    <Field
                        aria-label='Search reports'
                        placeholder='Search descriptions and players'
                        startContent={<FontAwesomeIcon icon={faSearch} />}
                        value={search}
                        onValueChange={setSearch}
                    />
                    <div className='flex min-h-8 items-center justify-between gap-2 px-2'>
                        <Checkbox
                            isSelected={allOnPageChecked}
                            isDisabled={reports.length === 0}
                            onChange={(isChecked) => {
                                for (const item of reports) {
                                    toggleChecked(item, isChecked);
                                }
                            }}
                        >
                            <Checkbox.Content className='flex items-center gap-3'>
                                <Checkbox.Control>
                                    <Checkbox.Indicator />
                                </Checkbox.Control>
                                <span className='text-sm text-ink-dim'>
                                    {checked.size > 0
                                        ? `${checked.size} selected`
                                        : 'Select this page'}
                                </span>
                            </Checkbox.Content>
                        </Checkbox>
                        {checked.size > 0 && (
                            <Button
                                size='sm'
                                variant='ghost'
                                className='text-danger'
                                isPending={isDeleting}
                                onPress={() => setReportsToDelete([...checked.values()])}
                            >
                                {isDeleting && <Spinner color='current' size='sm' />}
                                Delete {checked.size}
                            </Button>
                        )}
                    </div>
                    <div className='min-h-0 flex-1 overflow-y-auto border-t border-gold-hair'>
                        {isListLoading && <LoadingSpinner className='py-10' />}
                        {isListError && (
                            <Notice kind='error' className='mt-3'>
                                The reports couldn&apos;t be loaded.
                            </Notice>
                        )}
                        {!isListLoading && !isListError && reports.length === 0 && (
                            <p className='py-6 text-center text-sm text-ink-faint'>
                                {debouncedSearch ? 'No reports match.' : 'No problem reports.'}
                            </p>
                        )}
                        <ul>
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
                        </ul>
                    </div>
                    {pageCount > 1 && (
                        <Pager
                            className='self-center'
                            total={pageCount}
                            page={page}
                            onChange={setPage}
                        />
                    )}
                </section>

                <section
                    aria-label='Report'
                    className={classNames(
                        'flex min-h-0 min-w-0 flex-col gap-3 lg:border-l lg:border-gold-hair lg:pl-6',
                        !selectedId && 'max-lg:hidden'
                    )}
                >
                    {selectedId && (
                        <Button
                            size='sm'
                            variant='tertiary'
                            className='self-start lg:hidden'
                            onPress={() => setSelectedId(null)}
                        >
                            <FontAwesomeIcon icon={faArrowLeft} />
                            All reports
                        </Button>
                    )}
                    {detail}
                </section>
            </div>

            <ConfirmDialog
                isOpen={reportsToDelete.length > 0}
                isDestructive
                okLabel='Delete'
                cancelLabel='Keep'
                onOpenChange={(open) => !open && setReportsToDelete([])}
                title={
                    reportsToDelete.length === 1
                        ? 'Delete this problem report?'
                        : `Delete these ${reportsToDelete.length} problem reports?`
                }
                message={
                    <div className='flex flex-col gap-2'>
                        <ul className='flex max-h-64 flex-col gap-1 overflow-y-auto text-sm'>
                            {reportsToDelete.map((toDelete) => (
                                <li key={toDelete.id}>
                                    <span className='text-ink'>{toDelete.reporter}</span>,{' '}
                                    {moment(toDelete.createdAt).local().format('D MMM, H:mm')}
                                    {': '}
                                    <span className='text-ink-dim'>
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
        </AdminPage>
    );
};

export default ProblemReportsAdmin;
