import React, { useState, useCallback, useMemo } from 'react';
import moment from 'moment';

import Panel from '../Components/Site/Panel';
import {
    useDeleteNewsMutation,
    useGetAllNewsQuery,
    useSaveNewsMutation,
    useAddNewsMutation
} from '../redux/middleware/api';
import { toastr } from 'react-redux-toastr';
import AlertPanel from '../Components/Site/AlertPanel';
import {
    Button,
    Spinner,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow,
    Textarea
} from '@nextui-org/react';

const NewsAdmin = () => {
    const [editText, setEditText] = useState('');
    const [editItemId, setEditItemId] = useState(undefined);

    const { data: news, isLoading, error } = useGetAllNewsQuery();
    const [addNews, { isLoading: isAddLoading }] = useAddNewsMutation();
    const [deleteNews, { isLoading: isDeleteLoading }] = useDeleteNewsMutation();
    const [saveNews, { isLoading: isSaveLoading }] = useSaveNewsMutation();
    const [newsText, setNewsText] = useState('');

    const onAddNewsClick = useCallback(async () => {
        try {
            await addNews(newsText).unwrap();

            toastr.success('News added successfully.');

            setTimeout(() => {
                toastr.clean();
            }, 5000);
        } catch (err) {
            toastr.error(err || 'An error occured adding the news item. Please try again later.');
        }
    }, [addNews, newsText]);

    const onDeleteClick = useCallback(
        async (id) => {
            try {
                await deleteNews(id).unwrap();

                toastr.success('News deleted successfully.');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error(
                    err || 'An error occured deleting the news item. Please try again later.'
                );
            }
        },
        [deleteNews]
    );

    const onEditClick = useCallback((item) => {
        setEditItemId(item._id);
        setEditText(item.text);
    }, []);

    const onSaveClick = useCallback(async () => {
        try {
            await saveNews({ id: editItemId, text: editText }).unwrap();

            toastr.success('News edited successfully.');

            setTimeout(() => {
                toastr.clean();
            }, 5000);
        } catch (err) {
            toastr.error(err || 'An error occured editing the news item. Please try again later.');
        }
        setEditItemId(undefined);
        setEditText(undefined);
    }, [editItemId, editText, saveNews]);

    const renderedNews = useMemo(
        () =>
            news &&
            news.map((newsItem) => {
                return (
                    <TableRow key={newsItem._id}>
                        <TableCell>{moment(newsItem.datePublished).format('YYYY-MM-DD')}</TableCell>
                        <TableCell>{newsItem.poster}</TableCell>
                        <TableCell>
                            {editItemId === newsItem._id ? (
                                <Textarea
                                    label='Edit news item'
                                    value={editText}
                                    onValueChange={setEditText}
                                    rows='4'
                                />
                            ) : (
                                newsItem.text
                            )}
                        </TableCell>
                        <TableCell>
                            <div className='flex gap-2'>
                                {editItemId === newsItem._id ? (
                                    <Button
                                        color='primary'
                                        disabled={isAddLoading}
                                        onClick={onSaveClick}
                                    >
                                        Save{' '}
                                        {isAddLoading && (
                                            <span className='spinner button-spinner' />
                                        )}
                                    </Button>
                                ) : (
                                    <Button
                                        color='primary'
                                        onClick={() => onEditClick(newsItem)}
                                        disabled={isSaveLoading}
                                    >
                                        Edit{' '}
                                        {isSaveLoading && (
                                            <span className='spinner button-spinner' />
                                        )}
                                    </Button>
                                )}
                                <Button
                                    color='danger'
                                    onClick={() => onDeleteClick(newsItem._id)}
                                    disabled={isDeleteLoading}
                                >
                                    Delete {isDeleteLoading && <Spinner />}
                                </Button>
                            </div>
                        </TableCell>
                    </TableRow>
                );
            }),
        [
            editItemId,
            editText,
            isAddLoading,
            isDeleteLoading,
            isSaveLoading,
            news,
            onDeleteClick,
            onEditClick,
            onSaveClick
        ]
    );

    if (isLoading) {
        return 'Loading news, please wait...';
    }

    return (
        <div className='w-2/3 mx-auto'>
            {error && <AlertPanel variant='danger' message={error} />}
            <Panel title='News administration'>
                <Table isStriped>
                    <TableHeader>
                        <TableColumn className='w-1/5'>Date</TableColumn>
                        <TableColumn className='w-1/5'>Poster</TableColumn>
                        <TableColumn className='w-2/4'>Text</TableColumn>
                        <TableColumn className='w-1/4'>Action</TableColumn>
                    </TableHeader>
                    <TableBody>{renderedNews}</TableBody>
                </Table>
            </Panel>
            <div className='mt-2'>
                <Panel title='Add new news item'>
                    <Textarea label='Add news item' onValueChange={setNewsText} value={newsText} />
                    <div>
                        <Button
                            className='mt-2'
                            color='primary'
                            onClick={onAddNewsClick}
                            disabled={isAddLoading}
                        >
                            Add {isAddLoading && <Spinner />}
                        </Button>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default NewsAdmin;
