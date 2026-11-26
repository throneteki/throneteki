import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from '@heroui/react';
import { toast } from 'react-toastify';

import ConfirmDialog from '../../Components/Site/ConfirmDialog';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import Notice from '../../Components/Site/Notice';
import Tag from '../../Components/Site/Tag';
import { GameFormats, GameTypes } from '../../constants';
import {
    useDeleteEventMutation,
    useGetEventsQuery,
    useGetRestrictedListQuery
} from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';
import AdminPage from '../AdminPage';

export const legalityLabel = (event, restrictedLists) => {
    if (event.legality === 'custom') {
        return 'Custom card list';
    }

    if (event.legality === 'latest') {
        return 'Latest card list';
    }

    const list = restrictedLists?.find((rl) => rl._id === event.legality);

    return list ? list.version : 'Unknown card list';
};

const eventSummary = (event, restrictedLists) => {
    const format = GameFormats.find((f) => f.name === event.format);
    const variant = format?.variants?.find((v) => v.name === event.variant);
    const type = GameTypes.find((t) => t.name === event.gameType);

    return [
        format?.label ?? event.format,
        format?.variants?.length > 1 && variant?.label,
        type?.label,
        legalityLabel(event, restrictedLists)
    ]
        .filter(Boolean)
        .join(' · ');
};

const eventTags = (event) => {
    const options = event.useEventGameOptions ? event.eventGameOptions || {} : {};

    return [
        event.lockDecks && 'Decks lock',
        event.useEventGameOptions && 'Set game options',
        (options.password || options.hasPassword) && 'Password',
        options.useChessClocks && `${options.chessClockTimeLimit} min clocks`,
        options.useGameTimeLimit && `${options.gameTimeLimit} min limit`,
        Array.isArray(event.validTableCreators) &&
            `${event.validTableCreators.length} can create games`,
        Array.isArray(event.validSpectators) && `${event.validSpectators.length} can watch`
    ].filter(Boolean);
};

const EventsAdmin = () => {
    const dispatch = useDispatch();
    const { data: events, isLoading, isError } = useGetEventsQuery();
    const { data: restrictedLists } = useGetRestrictedListQuery();
    const [deleteEvent] = useDeleteEventMutation();
    const [deleting, setDeleting] = useState(null);
    const [deletingId, setDeletingId] = useState();

    const onDelete = async (event) => {
        setDeletingId(event._id);
        try {
            await deleteEvent(event._id).unwrap();
            toast.success('Event deleted');
        } catch (err) {
            toast.error(err?.data?.message || 'The event could not be deleted. Try again later.');
        } finally {
            setDeletingId(undefined);
        }
    };

    let content;
    if (isLoading) {
        content = <LoadingSpinner className='py-10' />;
    } else if (isError) {
        content = <Notice kind='error'>The events couldn&apos;t be loaded.</Notice>;
    } else if (!events?.length) {
        content = (
            <p className='py-6 text-center text-sm text-ink-dim'>
                No events yet. Add one to give tournament games fixed rules.
            </p>
        );
    } else {
        content = (
            <ul className='border-t border-gold-hair'>
                {events.map((event) => {
                    const tags = eventTags(event);

                    return (
                        <li
                            key={event._id}
                            className='flex flex-wrap items-center gap-x-4 gap-y-2 border-b border-gold-hair py-3'
                        >
                            <div className='min-w-0 flex-1 basis-72'>
                                <button
                                    type='button'
                                    className='text-left text-base text-ink hover:text-gold'
                                    onClick={() => dispatch(navigate(`/events/${event._id}`))}
                                >
                                    {event.name}
                                </button>
                                <p className='text-sm text-ink-dim'>
                                    {eventSummary(event, restrictedLists)}
                                </p>
                                {tags.length > 0 && (
                                    <ul className='mt-1.5 flex flex-wrap gap-1.5'>
                                        {tags.map((tag) => (
                                            <li key={tag}>
                                                <Tag>{tag}</Tag>
                                            </li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                            <div className='flex shrink-0 gap-1'>
                                <Button
                                    size='sm'
                                    variant='tertiary'
                                    onPress={() => dispatch(navigate(`/events/${event._id}`))}
                                >
                                    Edit
                                </Button>
                                <Button
                                    size='sm'
                                    variant='ghost'
                                    className='text-danger'
                                    isPending={deletingId === event._id}
                                    onPress={() => setDeleting(event)}
                                >
                                    {deletingId === event._id && (
                                        <Spinner color='current' size='sm' />
                                    )}
                                    Delete
                                </Button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        );
    }

    return (
        <AdminPage
            section='events'
            title='Events'
            description='Tournaments and leagues. Games created for an event use its format, card list and rules, and players pick it from the event list when they create a game.'
            actions={
                <Button variant='primary' onPress={() => dispatch(navigate('/events/add'))}>
                    Add event
                </Button>
            }
        >
            {content}
            <ConfirmDialog
                isOpen={!!deleting}
                isDestructive
                title={`Delete ${deleting?.name ?? 'this event'}?`}
                message='Players will no longer be able to create games for it. This can’t be undone.'
                okLabel='Delete'
                cancelLabel='Keep it'
                onOpenChange={(open) => !open && setDeleting(null)}
                onCancel={() => setDeleting(null)}
                onOk={() => {
                    onDelete(deleting);
                    setDeleting(null);
                }}
            />
        </AdminPage>
    );
};

export default EventsAdmin;
