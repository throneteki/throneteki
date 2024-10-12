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
import { faFilter, faRefresh } from '@fortawesome/free-solid-svg-icons';
import FaIconButton from '../Site/FaIconButton';
import {
    Button,
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
    onRowClick,
    onRowSelectionChange,
    remote = false
}) {
    const [{ pageIndex, pageSize }, setPagination] = useState({
        pageIndex: 0,
        pageSize: 10
    });
    const [sorting, setSorting] = useState(defaultSort);
    const [columnFilters, setColumnFilters] = useState([]);
    const pagination = useMemo(
        () => ({
            pageIndex,
            pageSize
        }),
        [pageIndex, pageSize]
    );
    const [rowSelection, setRowSelection] = useState(new Set([]));
    const [isFilterPopOverOpen, setFilterPopOverOpen] = useState({});

    const fetchDataOptions = {
        columnFilters,
        pageIndex: pageIndex + 1,
        pageSize,
        sorting: sorting
            ? [{ id: sorting.column.toString(), desc: sorting.direction === 'descending' }]
            : []
    };

    const {
        data: response,
        isLoading,
        isError,
        refetch
    } = dataLoadFn(dataLoadArg ? Object.assign(fetchDataOptions, dataLoadArg) : fetchDataOptions);

    let tableOptions;

    const tableSort = useMemo(() => {
        return sorting
            ? [
                  {
                      id: sorting.column,
                      desc: sorting.direction === 'descending'
                  }
              ]
            : [];
    }, [sorting]);

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
            pageCount: Math.ceil(response?.totalCount / pageSize) ?? -1,
            state: {
                sorting: sorting
                    ? [{ id: sorting.column.toString(), desc: sorting.direction === 'descending' }]
                    : [],
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
            state: {
                sorting: tableSort,
                rowSelection: [...rowSelection].reduce((keys, v) => {
                    keys[v] = true;
                    return keys;
                }, {})
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
                sortDescriptor={sorting}
                onSortChange={setSorting}
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
                                allowsSorting={header.column.columnDef.enableSorting !== false}
                            >
                                {flexRender(header.column.columnDef.header, header.getContext())}
                                {header.column.columnDef.meta?.groupingFilter && (
                                    <>
                                        <Popover
                                            placement='right'
                                            isOpen={isFilterPopOverOpen[header.id]}
                                            onOpenChange={(open) => {
                                                isFilterPopOverOpen[header.id] = open;

                                                const newState = Object.assign(
                                                    {},
                                                    isFilterPopOverOpen
                                                );

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
                                    </>
                                )}
                            </TableColumn>
                        )
                    )}
                </TableHeader>
                <TableBody
                    isLoading={isLoading}
                    loadingContent={<LoadingSpinner text='Loading data, please wait...' />}
                    emptyContent={
                        <AlertPanel variant={AlertType.Info}>
                            {'You have no decks. Create or import a new deck above!'}
                        </AlertPanel>
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
