import React, { useRef, useState } from 'react';
import moment from 'moment';
import { Button, Spinner } from '@heroui/react';
import { toast } from 'react-toastify';

import { TextAreaField } from '../Components/Site/Field';
import Group from '../Components/Site/Group';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Notice from '../Components/Site/Notice';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import {
    useDeleteNewsMutation,
    useGetAllNewsQuery,
    useSaveNewsMutation,
    useAddNewsMutation
} from '../redux/middleware/api';
import { getMessageWithLinks } from '../util';
import AdminPage from './AdminPage';

const errorMessage = (err, fallback) => err?.data?.message || err?.message || fallback;

const NewsAdmin = () => {
    const { data: newsResponse, isLoading, isError } = useGetAllNewsQuery();
    const news = newsResponse?.data;
    const [addNews, { isLoading: isAdding }] = useAddNewsMutation();
    const [deleteNews] = useDeleteNewsMutation();
    const [saveNews, { isLoading: isSaving }] = useSaveNewsMutation();
    const [text, setText] = useState('');
    const [editing, setEditing] = useState(null);
    const [deleting, setDeleting] = useState(null);
    const editorRef = useRef();

    const stopEditing = () => {
        setEditing(null);
        setText('');
    };

    const onSubmit = async () => {
        try {
            if (editing) {
                await saveNews({ id: editing._id, text }).unwrap();
                toast.success('News item saved');
                stopEditing();
            } else {
                await addNews(text).unwrap();
                toast.success('News posted');
                setText('');
            }
        } catch (err) {
            toast.error(errorMessage(err, 'The news item could not be saved. Try again later.'));
        }
    };

    const onDelete = async () => {
        try {
            await deleteNews(deleting._id).unwrap();
            if (editing?._id === deleting._id) {
                stopEditing();
            }
            toast.success('News item deleted');
        } catch (err) {
            toast.error(errorMessage(err, 'The news item could not be deleted. Try again later.'));
        }
    };

    let list;
    if (isLoading) {
        list = <LoadingSpinner className='py-10' />;
    } else if (isError) {
        list = <Notice kind='error'>The news couldn&apos;t be loaded.</Notice>;
    } else if (!news?.length) {
        list = <p className='py-6 text-center text-sm text-ink-dim'>No news yet.</p>;
    } else {
        list = (
            <ul className='border-t border-gold-hair'>
                {news.map((item) => (
                    <li
                        key={item._id}
                        className={
                            editing?._id === item._id
                                ? '-mx-3 flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-gold-hair bg-gold/[0.06] px-3 py-3'
                                : 'flex flex-wrap items-start gap-x-4 gap-y-2 border-b border-gold-hair py-3'
                        }
                    >
                        <div className='min-w-0 flex-1 basis-80'>
                            <span className='text-xs text-ink-faint'>
                                {moment(item.datePublished).format('D MMM YYYY, H:mm')},{' '}
                                {item.poster}
                            </span>
                            <p className='mt-0.5 text-sm leading-relaxed text-ink [overflow-wrap:anywhere]'>
                                {getMessageWithLinks(item.text)}
                            </p>
                        </div>
                        <div className='flex shrink-0 gap-1'>
                            <Button
                                size='sm'
                                variant='tertiary'
                                isDisabled={editing?._id === item._id}
                                onPress={() => {
                                    setEditing(item);
                                    setText(item.text);
                                    editorRef.current?.scrollIntoView({
                                        behavior: 'smooth',
                                        block: 'center'
                                    });
                                }}
                            >
                                Edit
                            </Button>
                            <Button
                                size='sm'
                                variant='ghost'
                                className='text-danger'
                                onPress={() => setDeleting(item)}
                            >
                                Delete
                            </Button>
                        </div>
                    </li>
                ))}
            </ul>
        );
    }

    const isBusy = isAdding || isSaving;

    return (
        <AdminPage
            section='news'
            title='News'
            description='The newest item shows in the strip above the lobby chat; All news lists the rest.'
        >
            <div ref={editorRef}>
                <Group
                    title={editing ? 'Edit news' : 'Post news'}
                    description={
                        editing
                            ? `Editing the item ${editing.poster} posted on ${moment(editing.datePublished).format('D MMM YYYY')}.`
                            : 'Links become clickable and show as just the site and path.'
                    }
                >
                    <form
                        className='flex flex-col gap-3'
                        onSubmit={(event) => {
                            event.preventDefault();
                            onSubmit();
                        }}
                    >
                        <TextAreaField
                            aria-label='News text'
                            value={text}
                            onValueChange={setText}
                            minRows={3}
                            placeholder='What is happening?'
                        />
                        {text && (
                            <p className='text-sm leading-relaxed text-ink-dim [overflow-wrap:anywhere]'>
                                <span className='me-2 text-xs text-ink-faint'>Preview</span>
                                {getMessageWithLinks(text)}
                            </p>
                        )}
                        <div className='flex justify-end gap-2'>
                            {editing && (
                                <Button variant='tertiary' onPress={stopEditing}>
                                    Cancel
                                </Button>
                            )}
                            <Button
                                type='submit'
                                variant='primary'
                                isDisabled={!text.trim() || text === editing?.text}
                                isPending={isBusy}
                            >
                                {isBusy && <Spinner color='current' size='sm' />}
                                {editing ? 'Save changes' : 'Post'}
                            </Button>
                        </div>
                    </form>
                </Group>
            </div>
            <Group title='Published'>{list}</Group>
            <ConfirmDialog
                isOpen={!!deleting}
                isDestructive
                title='Delete this news item?'
                message={deleting?.text}
                okLabel='Delete'
                cancelLabel='Keep it'
                onOpenChange={(open) => !open && setDeleting(null)}
                onCancel={() => setDeleting(null)}
                onOk={() => {
                    onDelete();
                    setDeleting(null);
                }}
            />
        </AdminPage>
    );
};

export default NewsAdmin;
