import React, { forwardRef, useEffect, useMemo, useState } from 'react';
import {
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    useReactTable,
    getSortedRowModel
} from '@tanstack/react-table';

import TablePagination from './TablePagination';
import LoadingSpinner from '../Site/LoadingSpinner';
import {
    faArrowDownLong,
    faArrowUpLong,
    faFilter,
    faRefresh,
    faSearch
} from '@fortawesome/free-solid-svg-icons';
import FaIconButton from '../Site/FaIconButton';
import {
    Button,
    Input,
    Popover,
    PopoverContent,
    PopoverTrigger,
    Select,
    SelectItem,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// eslint-disable-next-line react/display-name
const TableWrapper = forwardRef(({ children, ref }) => {
    return (
        <div className='h-full overflow-y-auto'>
            <table ref={ref}>{children}</table>
        </div>
    );
});

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
    remote = false
}) {
    const [pagination, setPagination] = useState({
        pageIndex: startPageNumber,
        pageSize: 10
    });
    const [sorting, setSorting] = useState(defaultSort);
    const [columnFilters, setColumnFilters] = useState([]);
    const [rowSelection, setRowSelection] = useState(new Set([]));
    const [isFilterPopOverOpen, setFilterPopOverOpen] = useState({});

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
            pageCount: Math.ceil(response?.totalCount / pagination.pageSize) ?? -1,
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

    const topContent = useMemo(
        () => (
            <div className='flex justify-between'>
                <div className='flex'>
                    {buttons.map((b) => (
                        <Button
                            className='mr-2'
                            key={b.label}
                            color={b.color}
                            endContent={b.icon}
                            onClick={b.onClick}
                            isDisabled={b.disabled}
                            isLoading={b.isLoading}
                        >
                            {b.label}
                        </Button>
                    ))}
                </div>
                {refetch && (
                    <FaIconButton
                        color='default'
                        icon={faRefresh}
                        onClick={() => refetch()}
                    ></FaIconButton>
                )}
            </div>
        ),
        [buttons, refetch]
    );

    useEffect(() => {
        for (const [columnId, filter] of Object.entries(defaultColumnFilters)) {
            table.getColumn(columnId)?.setFilterValue(filter);
        }
    }, [defaultColumnFilters, table]);

    useEffect(() => {
        if (rowSelection === 'all' || rowSelection.size > 0) {
            onRowSelectionChange && onRowSelectionChange(table.getSelectedRowModel().flatRows);
        } else {
            onRowSelectionChange && onRowSelectionChange([]);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

    if (isLoading) {
        return <LoadingSpinner text='Loading data, please wait...' />;
    } else if (isError) {
        return <AlertPanel variant='danger'>{'An error occurred loading data.'}</AlertPanel>;
    }

    const currPage = table.getState().pagination.pageIndex + 1;
    const pageCount = table.getPageCount();
    const totalCount = remote ? response?.totalCount : response[dataProperty]?.length || 0;

    const tableFooter = (
        <div className='mt-3 flex flex-col'>
            <div className='flex'>
                <div className='flex justify-start'>
                    <Select
                        className='mr-2 w-20'
                        labelPlacement='outside'
                        onChange={(e) => {
                            table.setPageSize(parseInt(e.target.value));
                        }}
                        disallowEmptySelection
                        selectedKeys={new Set([table.getState().pagination.pageSize.toString()])}
                    >
                        {[10, 25, 50].map((pageSize) => (
                            <SelectItem key={pageSize.toString()} value={pageSize}>
                                {pageSize.toString()}
                            </SelectItem>
                        ))}
                    </Select>
                </div>
                <TablePagination
                    currentPage={table.getState().pagination.pageIndex + 1}
                    pageCount={table.getPageCount()}
                    setCurrentPage={(page) => table.setPageIndex(page - 1)}
                />
            </div>
            <div className='flex justify-start mt-2'>
                Page {currPage} of {pageCount} ({totalCount} items)
            </div>
        </div>
    );

    return (
        <>
            <Table
                isStriped
                isHeaderSticky
                showSelectionCheckboxes
                selectionMode={disableSelection ? 'none' : 'multiple'}
                selectedKeys={rowSelection}
                onSelectionChange={setRowSelection}
                topContent={topContent}
                bottomContent={tableFooter}
                removeWrapper
                classNames={{ base: 'h-full' }}
                as={TableWrapper}
            >
                <TableHeader>
                    {table.getHeaderGroups()[0].headers.map((header) =>
                        header.isPlaceholder ? null : (
                            <TableColumn
                                key={header.id}
                                width={header.column.columnDef.meta?.colWidth}
                                allowsSorting={false}
                            >
                                <div className='flex flex-col'>
                                    <div
                                        className='flex gap-1'
                                        role={header.column.getCanSort() ? 'button' : ''}
                                        onClick={header.column.getToggleSortingHandler()}
                                    >
                                        <span className='flex-grow-1'>
                                            {flexRender(
                                                header.column.columnDef.header,
                                                header.getContext()
                                            )}
                                        </span>
                                        {
                                            {
                                                asc: (
                                                    <div>
                                                        {' '}
                                                        <FontAwesomeIcon icon={faArrowUpLong} />
                                                    </div>
                                                ),
                                                desc: (
                                                    <div>
                                                        {' '}
                                                        <FontAwesomeIcon icon={faArrowDownLong} />
                                                    </div>
                                                )
                                            }[header.column.getIsSorted()]
                                        }
                                    </div>
                                    {header.column.getCanFilter() &&
                                        !header.column.columnDef.meta?.groupingFilter && (
                                            <Input
                                                className='select-text'
                                                onClick={(e) => {
                                                    // Something steals focus, probably the parent, without this code
                                                    e.target.focus();
                                                    e.stopPropagation();
                                                    e.preventDefault();
                                                }}
                                                onChange={(e) =>
                                                    header.column.setFilterValue(e.target.value)
                                                }
                                                onClear={() => header.column.setFilterValue('')}
                                                value={header.column.getFilterValue() || ''}
                                                size='sm'
                                                isClearable
                                                startContent={
                                                    <div>
                                                        <FontAwesomeIcon icon={faSearch} />
                                                    </div>
                                                }
                                            />
                                        )}
                                </div>
                                {header.column.columnDef.meta?.groupingFilter && (
                                    <Popover
                                        placement='right'
                                        isOpen={isFilterPopOverOpen[header.id]}
                                        onOpenChange={(open) => {
                                            isFilterPopOverOpen[header.id] = open;

                                            const newState = Object.assign({}, isFilterPopOverOpen);

                                            setFilterPopOverOpen(newState);
                                        }}
                                    >
                                        <PopoverTrigger>
                                            <FontAwesomeIcon className='ml-1' icon={faFilter} />
                                        </PopoverTrigger>
                                        <PopoverContent>
                                            {header.column.columnDef.meta?.groupingFilter(
                                                header.getContext().table,
                                                () => {
                                                    isFilterPopOverOpen[header.id] =
                                                        !isFilterPopOverOpen[header.id];

                                                    const newState = Object.assign(
                                                        {},
                                                        isFilterPopOverOpen
                                                    );

                                                    setFilterPopOverOpen(newState);
                                                }
                                            )}
                                        </PopoverContent>
                                    </Popover>
                                )}
                            </TableColumn>
                        )
                    )}
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    loadingContent={<LoadingSpinner text='Loading data, please wait...' />}
                    emptyContent={
                        emptyContent || (
                            <AlertPanel variant={AlertType.Info}>
                                {'There is no data to display'}
                            </AlertPanel>
                        )
                    }
                >
                    {table.getRowModel().rows.map((row) => (
                        <TableRow key={row.id} onClick={() => onRowClick && onRowClick(row)}>
                            {row.getVisibleCells().map((cell) => (
                                <TableCell key={cell.id}>
                                    <div>
                                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                    </div>
                                </TableCell>
                            ))}
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </>
    );
}

export default ReactTable;
