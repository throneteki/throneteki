import React, { useState, useCallback, useMemo } from 'react';
import moment from 'moment';

import Panel from '../Components/Site/Panel';
import {
    useDeleteNewsMutation,
    useGetAllNewsQuery,
    useSaveNewsMutation,
    useAddNewsMutation
} from '../redux/middleware/api';
import AlertPanel from '../Components/Site/AlertPanel';
import { Button, Textarea } from '@heroui/react';
import ReactTable from '../Components/Table/ReactTable';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import { toast } from 'react-toastify';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import Page from './Page';

const NewsAdmin = () => {
    const { data: news, isLoading, error } = useGetAllNewsQuery();
    const [addNews, { isLoading: isAddLoading }] = useAddNewsMutation();
    const [deleteNews, { isLoading: isDeleteLoading }] = useDeleteNewsMutation();
    const [saveNews, { isLoading: isSaveLoading }] = useSaveNewsMutation();
    const [newsText, setNewsText] = useState('');
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showConfirm, setShowConfirm] = useState(false);
    const [selectedRows, setSelectedRows] = useState(new Set([]));

    const onAddNewsClick = useCallback(async () => {
        try {
            await addNews(newsText).unwrap();

            toast.success('News added successfully.');
        } catch (err) {
            toast.error(err || 'An error occured adding the news item. Please try again later.');
        }
    }, [addNews, newsText]);

    const onSaveClick = useCallback(async () => {
        try {
            await saveNews({ id: selectedItem._id, text: newsText }).unwrap();
            setSelectedItem(null);
            setNewsText('');

            toast.success('News edited successfully.');
        } catch (err) {
            toast.error(err || 'An error occured editing the news item. Please try again later.');
        }
    }, [newsText, saveNews, selectedItem?._id]);

    const columns = useMemo(
        () => [
            {
                accessorKey: 'datePublished',
                header: 'Published At',
                cell: (info) => moment(info.getValue()).local().format('YYYY-MM-DD HH:mm'),
                meta: {
                    colWidth: '25%'
                },
                sortingFn: 'datetime'
            },
            {
                accessorKey: 'poster',
                header: 'Poster',
                cell: (info) => {
                    return info.getValue();
                },
                meta: {
                    colWidth: '25%'
                }
            },
            {
                accessorKey: 'text',
                header: 'Text',
                cell: (info) => {
                    return info.getValue();
                },
                meta: {
                    colWidth: '55%'
                }
            }
        ],
        []
    );

    const buttons = [
        {
            color: 'danger',
            icon: <FontAwesomeIcon icon={faTrashAlt} />,
            label: 'Delete',
            disabled: selectedIds.length === 0,
            isLoading: isDeleteLoading,
            onPress: () => {
                setShowConfirm(true);
            }
        }
    ];

    if (isLoading) {
        return <LoadingSpinner label='Loading news...' />;
    }
    return (
        <Page>
            {error && <AlertPanel variant='danger' message={error} />}
            <Panel title='News administration'>
                <div className='flex flex-col gap-1'>
                    <p>Add a new news item below, or click an existing one to edit it.</p>
                    <div className='h-[400px]'>
                        <ReactTable
                            buttons={buttons}
                            columns={columns}
                            dataLoadFn={() => ({
                                data: news,
                                isLoading: isLoading,
                                isError: false
                            })}
                            onRowClick={(row) => {
                                setSelectedItem(row.original);
                                setNewsText(row.original.text);
                            }}
                            onRowSelectionChange={(ids) =>
                                setSelectedIds(ids.map((r) => r.original._id))
                            }
                            selectedRows={selectedRows}
                        />
                    </div>
                </div>
            </Panel>
            <Panel
                title={
                    selectedItem
                        ? `Edit existing news item by ${selectedItem.poster}`
                        : 'Add new news item'
                }
            >
                <Textarea
                    label={selectedItem ? 'Updated news text' : 'Enter new news text'}
                    onValueChange={setNewsText}
                    value={newsText}
                />
                <div>
                    {selectedItem ? (
                        <div>
                            <Button
                                className='mr-2 mt-2'
                                color='primary'
                                isLoading={isSaveLoading}
                                onPress={onSaveClick}
                                isDisabled={newsText === ''}
                            >
                                Overwrite & Save
                            </Button>
                            <Button
                                className='mt-2'
                                color='default'
                                onPress={() => {
                                    setSelectedItem(null);
                                    setNewsText('');
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    ) : (
                        <Button
                            className='mt-2'
                            color='primary'
                            isLoading={isAddLoading}
                            onPress={() => onAddNewsClick(newsText)}
                        >
                            Add
                        </Button>
                    )}
                </div>
            </Panel>
            <ConfirmDialog
                isOpen={showConfirm}
                message={`Are you sure you want to delete ${
                    selectedIds.length === 1 ? 'this news entry' : 'these news entries'
                }?`}
                onOpenChange={setShowConfirm}
                onCancel={() => setShowConfirm(false)}
                onOk={async () => {
                    try {
                        await deleteNews(selectedIds[0]).unwrap();

                        setSelectedIds([]);
                        setSelectedRows(new Set([]));

                        toast.success('News deleted successfully');
                    } catch (err) {
                        toast.error(
                            err ||
                                'An error occured deleting the news item(s). Please try again later'
                        );
                    }
                }}
            />
        </Page>
    );
};

export default NewsAdmin;
