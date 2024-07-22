import React, { useState, useCallback, useMemo } from 'react';
import moment from 'moment';

import Form from '../Components/Form/Form';
import TextArea from '../Components/Form/TextArea';
import Panel from '../Components/Site/Panel';
import {
    useDeleteNewsMutation,
    useGetNewsQuery,
    useSaveNewsMutation,
    useAddNewsMutation
} from '../redux/middleware/api';
import { toastr } from 'react-redux-toastr';
import AlertPanel from '../Components/Site/AlertPanel';

const NewsAdmin = () => {
    const [editText, setEditText] = useState('');
    const [editItemId, setEditItemId] = useState(undefined);

    const { data: news, isLoading, error } = useGetNewsQuery(5);
    const [addNews, { isLoading: isAddLoading }] = useAddNewsMutation();
    const [deleteNews, { isLoading: isDeleteLoading }] = useDeleteNewsMutation();
    const [saveNews, { isLoading: isSaveLoading }] = useSaveNewsMutation();

    const onAddNewsClick = useCallback(
        async (state) => {
            try {
                await addNews(state.newsText).unwrap();

                toastr.success('News added successfully.');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error(
                    err || 'An error occured adding the news item. Please try again later.'
                );
            }
        },
        [addNews]
    );

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
                    <tr key={newsItem._id}>
                        <td>{moment(newsItem.datePublished).format('YYYY-MM-DD')}</td>
                        <td>{newsItem.poster}</td>
                        <td>
                            {editItemId === newsItem._id ? (
                                <TextArea
                                    name='newsEditText'
                                    value={editText}
                                    onChange={(event) => setEditText(event.target.value)}
                                    rows='4'
                                />
                            ) : (
                                newsItem.text
                            )}
                        </td>
                        <td>
                            <div className='btn-group'>
                                {editItemId === newsItem._id ? (
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        disabled={isAddLoading}
                                        onClick={onSaveClick}
                                    >
                                        Save{' '}
                                        {isAddLoading && (
                                            <span className='spinner button-spinner' />
                                        )}
                                    </button>
                                ) : (
                                    <button
                                        type='button'
                                        className='btn btn-primary'
                                        onClick={() => onEditClick(newsItem)}
                                        disabled={isSaveLoading}
                                    >
                                        Edit{' '}
                                        {isSaveLoading && (
                                            <span className='spinner button-spinner' />
                                        )}
                                    </button>
                                )}
                                <button
                                    type='button'
                                    className='btn btn-danger'
                                    onClick={() => onDeleteClick(newsItem._id)}
                                    disabled={isDeleteLoading}
                                >
                                    Delete{' '}
                                    {isDeleteLoading && <span className='spinner button-spinner' />}
                                </button>
                            </div>
                        </td>
                    </tr>
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
        <div className='col-xs-12'>
            {error && <AlertPanel type='error' message={error} />}
            <Panel title='News administration'>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className='col-sm-1'>Date</th>
                            <th className='col-sm-1'>Poster</th>
                            <th className='col-sm-8'>Text</th>
                            <th className='col-sm-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>{renderedNews}</tbody>
                </table>
            </Panel>
            <Panel title='Add new news item'>
                <Form
                    name='newsAdmin'
                    apiLoading={isAddLoading}
                    buttonClass='col-sm-offset-2 col-sm-4'
                    buttonText='Add'
                    onSubmit={onAddNewsClick}
                />
            </Panel>
        </div>
    );
};

export default NewsAdmin;
