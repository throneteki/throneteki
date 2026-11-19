import React, { useEffect, useRef, useState } from 'react';
import Field from '../Site/Field';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel
} from '@tanstack/react-table';

import LoadingSpinner from '../Site/LoadingSpinner';
import {
    faArrowDownLong,
    faArrowUpLong,
    faFilter,
    faRefresh,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import { Button, Checkbox, Popover, Table, Spinner } from '@heroui/react';
import classNames from 'classnames';
import SelectField from '../Site/SelectField';
import Pager from '../Site/Pager';
import Notice from '../Site/Notice';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const buttonProps = (color) => {
    if (color === 'danger') {
        return { variant: 'ghost', className: 'text-danger' };
    }

    return { variant: color === 'primary' ? 'primary' : 'tertiary' };
};

function ReactTable({
    buttons = [],
    columns,
    dataLoadFn,
    dataLoadArg = null,
    dataProperty = 'data',
    defaultColumnFilters = {},
    defaultSort,
    disableSelection = false,
    emptyContent,
    onRowClick,
    onRowSelectionChange,
    onPageChanged,
    startPageNumber = 0,
    selectedRows,
    remote = false,
    renderCard,
    classNames: tableClasses
}) {
    const tableRef = useRef(null);
    const [pagination, setPagination] = useState({
        pageIndex: startPageNumber,
        pageSize: 10
    });
    const [sorting, setSorting] = useState(defaultSort);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState(selectedRows || new Set([]));
    const [isFilterPopOverOpen, setFilterPopOverOpen] = useState({});

    useEffect(() => {
        setRowSelection(selectedRows || new Set([]));
    }, [selectedRows]);

    const fetchDataOptions = {
        columnFilters,
        pageIndex: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sorting: sorting || []
    };

    const {
        data: response,
        isLoading,
        isError,
        refetch
    } = dataLoadFn(dataLoadArg ? Object.assign(fetchDataOptions, dataLoadArg) : fetchDataOptions);

    let tableOptions;

    if (remote) {
        tableOptions = {
            data: response ? response[dataProperty] : null,
            columns,
            enableFilters: true,
            getCoreRowModel: getCoreRowModel(),
            manualFiltering: true,
            manualPagination: true,
            manualSorting: true,
            onPaginationChange: setPagination,
            onColumnFiltersChange: setColumnFilters,
            onSortingChange: setSorting,
            pageCount:
                response?.totalCount != null
                    ? Math.ceil(response.totalCount / pagination.pageSize)
                    : -1,
            state: {
                sorting: sorting || [],
                pagination: pagination,
                columnFilters: columnFilters,
                rowSelection: [...rowSelection].reduce((keys, v) => {
                    keys[v] = true;
                    return keys;
                }, {})
            }
        };
    } else {
        tableOptions = {
            columns,
            data: response ? response[dataProperty] : null,
            getCoreRowModel: getCoreRowModel(),
            getFilteredRowModel: getFilteredRowModel(),
            getPaginationRowModel: getPaginationRowModel(),
            getSortedRowModel: getSortedRowModel(),
            onSortingChange: setSorting,
            onColumnFiltersChange: setColumnFilters,
            onPaginationChange: (pi) => {
                setPagination(pi);
                onPageChanged(table.getState().pagination.pageIndex);
            },
            state: {
                sorting,
                rowSelection: [...rowSelection].reduce((keys, v) => {
                    keys[v] = true;
                    return keys;
                }, {}),
                pagination,
                columnFilters
            }
        };
    }

    const table = useReactTable(tableOptions);

    const topContent = (
        <div className='flex flex-wrap items-center gap-2'>
            {buttons.map((b) => (
                <Button
                    key={b.label}
                    {...buttonProps(b.color)}
                    onPress={b.onPress}
                    isDisabled={b.disabled}
                    isPending={b.isLoading}
                >
                    {b.isLoading ? <Spinner color='current' size='sm' /> : b.icon}
                    <span
                        className={classNames({
                            'max-sm:sr-only': renderCard && b.color !== 'primary' && b.icon
                        })}
                    >
                        {b.label}
                    </span>
                </Button>
            ))}
            {refetch && (
                <Button
                    aria-label='Refresh'
                    className='ms-auto text-ink-dim'
                    isIconOnly
                    onPress={() => refetch()}
                    variant='ghost'
                >
                    <FontAwesomeIcon icon={faRefresh} />
                </Button>
            )}
        </div>
    );

    useEffect(() => {
        for (const [columnId, filter] of Object.entries(defaultColumnFilters)) {
            table.getColumn(columnId)?.setFilterValue(filter);
        }
    }, [defaultColumnFilters, table]);

    useEffect(() => {
        if (rowSelection.size > 0) {
            onRowSelectionChange && onRowSelectionChange(table.getSelectedRowModel().flatRows);
        } else {
            onRowSelectionChange && onRowSelectionChange([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

    if (isLoading) {
        return <LoadingSpinner />;
    } else if (isError) {
        return (
            <Notice kind='error'>Something went wrong loading this list. Please try again.</Notice>
        );
    }

    const currPage = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();
    const totalCount =
        (remote ? response?.totalCount : table.getPrePaginationRowModel().rows.length) || 0;

    const selectionCheckbox = (label) => (
        <Checkbox aria-label={label} slot='selection'>
            <Checkbox.Content>
                <Checkbox.Control>
                    <Checkbox.Indicator />
                </Checkbox.Control>
            </Checkbox.Content>
        </Checkbox>
    );

    const toggleFilterPopover = (headerId, open) => {
        setFilterPopOverOpen({ ...isFilterPopOverOpen, [headerId]: open });
    };

    const headers = table.getHeaderGroups()[0].headers.filter((header) => !header.isPlaceholder);

    const filterField = (header, className) => (
        <Field
            className={classNames('select-text font-sans font-normal', className)}
            inputClassName='font-sans'
            aria-label={header.column.columnDef.header}
            placeholder={header.column.columnDef.header}
            startContent={<FontAwesomeIcon icon={faSearch} />}
            onKeyDown={(event) => event.stopPropagation()}
            onValueChange={header.column.setFilterValue}
            value={header.column.getFilterValue() || ''}
        />
    );

    const groupingFilter = (header, key, trigger) => (
        <Popover
            key={key}
            isOpen={!!isFilterPopOverOpen[key]}
            onOpenChange={(open) => toggleFilterPopover(key, open)}
        >
            {trigger}
            <Popover.Content offset={12}>
                <Popover.Dialog>
                    {header.column.columnDef.meta.groupingFilter(header.getContext().table, () =>
                        toggleFilterPopover(key, !isFilterPopOverOpen[key])
                    )}
                </Popover.Dialog>
            </Popover.Content>
        </Popover>
    );

    const emptyMessage = emptyContent || 'There is nothing to show here yet.';

    const toggleRowSelected = (id) =>
        setRowSelection((current) => {
            const next = new Set(current);
            if (next.has(id)) {
                next.delete(id);
            } else {
                next.add(id);
            }
            return next;
        });

    const sortOptions = headers
        .filter((header) => header.column.getCanSort())
        .flatMap((header) => {
            const name = header.column.columnDef.header;
            const labels = header.column.columnDef.meta?.sortLabels || {
                asc: `${name}, A to Z`,
                desc: `${name}, Z to A`
            };

            return Object.keys(labels).map((direction) => ({
                id: `${header.id}:${direction}`,
                label: labels[direction]
            }));
        });
    const currentSort = sorting?.[0];

    const cardList = renderCard && (
        <div className='flex flex-col gap-3 sm:hidden'>
            {sortOptions.length > 0 && (
                <SelectField
                    aria-label='Sort by'
                    items={sortOptions}
                    value={
                        currentSort
                            ? `${currentSort.id}:${currentSort.desc ? 'desc' : 'asc'}`
                            : null
                    }
                    placeholder='Sort by'
                    renderValue={(key) =>
                        `Sort: ${sortOptions.find((option) => option.id === key)?.label ?? ''}`
                    }
                    onChange={(key) => {
                        const [id, direction] = String(key).split(':');
                        setSorting([{ id, desc: direction === 'desc' }]);
                    }}
                />
            )}
            <div className='flex gap-2'>
                {headers
                    .filter((header) => header.column.getCanFilter())
                    .map((header) =>
                        header.column.columnDef.meta?.groupingFilter
                            ? groupingFilter(
                                  header,
                                  `${header.id}-card`,
                                  <Button variant='tertiary'>
                                      <FontAwesomeIcon icon={faFilter} />
                                      {header.column.columnDef.header}
                                  </Button>
                              )
                            : filterField(header, 'min-w-0 flex-1')
                    )}
            </div>
            {table.getRowModel().rows.length === 0 ? (
                <p className='py-8 text-center text-sm text-ink-dim'>{emptyMessage}</p>
            ) : (
                <ul className='border-t border-gold-hair'>
                    {table.getRowModel().rows.map((row) => (
                        <li key={row.id} className='border-b border-gold-hair'>
                            {renderCard(row, {
                                isSelected: rowSelection.has(row.id),
                                toggleSelected: () => toggleRowSelected(row.id)
                            })}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );

    return (
        <div className={classNames('flex h-full flex-col gap-3', tableClasses?.base)}>
            {topContent}
            {cardList}
            <Table
                variant='secondary'
                ref={tableRef}
                className={classNames('min-h-0 flex-1', { 'max-sm:hidden': renderCard })}
            >
                <Table.ScrollContainer className='h-full overflow-y-auto'>
                    <Table.Content
                        aria-label='Generic Table'
                        selectionMode={disableSelection ? 'none' : 'multiple'}
                        selectedKeys={rowSelection}
                        onSelectionChange={(keys) =>
                            setRowSelection(
                                keys === 'all'
                                    ? new Set(
                                          table.getPrePaginationRowModel().rows.map((row) => row.id)
                                      )
                                    : keys
                            )
                        }
                        onRowAction={(key) =>
                            onRowClick && onRowClick(table.getRowModel().rows[key])
                        }
                    >
                        <Table.Header>
                            {!disableSelection && (
                                <Table.Column className='w-8 pe-0'>
                                    {selectionCheckbox('Select all')}
                                </Table.Column>
                            )}
                            {headers.map((header, index) => (
                                <Table.Column
                                    key={header.id}
                                    id={header.id}
                                    isRowHeader={index === 0}
                                    className={header.column.columnDef.meta?.className}
                                    width={header.column.columnDef.meta?.colWidth}
                                >
                                    {header.column.getCanFilter() &&
                                    !header.column.columnDef.meta?.groupingFilter ? (
                                        filterField(header)
                                    ) : (
                                        <div className='flex items-center gap-1'>
                                            <button
                                                type='button'
                                                className='flex items-center gap-1'
                                                disabled={!header.column.getCanSort()}
                                                onClick={header.column.getToggleSortingHandler()}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                                {header.column.getIsSorted() === 'asc' && (
                                                    <FontAwesomeIcon icon={faArrowUpLong} />
                                                )}
                                                {header.column.getIsSorted() === 'desc' && (
                                                    <FontAwesomeIcon icon={faArrowDownLong} />
                                                )}
                                            </button>
                                            {header.column.getCanFilter() &&
                                                header.column.columnDef.meta?.groupingFilter &&
                                                groupingFilter(
                                                    header,
                                                    header.id,
                                                    <Popover.Trigger
                                                        aria-label={`Filter ${header.column.columnDef.header}`}
                                                    >
                                                        <FontAwesomeIcon icon={faFilter} />
                                                    </Popover.Trigger>
                                                )}
                                        </div>
                                    )}
                                </Table.Column>
                            ))}
                        </Table.Header>
                        <Table.Body
                            renderEmptyState={() => (
                                <p className='sticky left-0 max-w-[calc(100vw-4.5rem)] whitespace-normal py-8 text-center text-sm text-ink-dim'>
                                    {emptyMessage}
                                </p>
                            )}
                        >
                            {table.getRowModel().rows.map((row) => (
                                <Table.Row key={row.id} id={row.id}>
                                    {!disableSelection && (
                                        <Table.Cell className='pe-0'>
                                            {selectionCheckbox('Select row')}
                                        </Table.Cell>
                                    )}
                                    {row.getVisibleCells().map((cell) => (
                                        <Table.Cell
                                            key={cell.id}
                                            className={cell.column.columnDef.meta?.className}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </Table.Cell>
                                    ))}
                                </Table.Row>
                            ))}
                        </Table.Body>
                    </Table.Content>
                </Table.ScrollContainer>
            </Table>
            {totalCount > 10 && (
                <div className='flex flex-wrap items-center gap-3'>
                    {pageCount > 1 && (
                        <Pager
                            page={currPage}
                            total={pageCount}
                            onChange={(page) => table.setPageIndex(page - 1)}
                        />
                    )}
                    <span className='text-sm tabular-nums text-ink-dim'>
                        Page {currPage} of {pageCount}, {totalCount} in all
                    </span>
                    <SelectField
                        aria-label='Rows per page'
                        className='ms-auto w-20'
                        value={table.getState().pagination.pageSize.toString()}
                        onChange={(value) => table.setPageSize(parseInt(value))}
                        items={[10, 25, 50].map((pageSize) => ({
                            id: pageSize.toString(),
                            label: pageSize.toString()
                        }))}
                    />
                </div>
            )}
        </div>
    );
}

export default ReactTable;
