import React, { useRef, useState } from 'react';
import moment from 'moment';
import classNames from 'classnames';
import { Button } from '@heroui/react';
import { toast } from 'react-toastify';

import BannerEditor from '../Components/Banners/BannerEditor';
import { bannerStatus } from '../Components/Banners/bannerDates';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import Group from '../Components/Site/Group';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import Notice from '../Components/Site/Notice';
import {
    useDeleteBannerMutation,
    useGetAllBannersQuery,
    useGetEventsQuery
} from '../redux/middleware/api';
import { bannerImageUrl } from '../util';
import AdminPage from './AdminPage';

const StatusDots = {
    Live: 'bg-success',
    Scheduled: 'bg-accent',
    'No image': 'bg-warning',
    Expired: 'bg-ink-faint'
};

const StatusLabels = {
    Live: 'Showing',
    Scheduled: 'Scheduled',
    'No image': 'Hidden: no image',
    Expired: 'Finished'
};

const Sections = [
    { title: 'Showing now', statuses: ['Live'] },
    { title: 'Not showing yet', statuses: ['Scheduled', 'No image'] },
    { title: 'Finished', statuses: ['Expired'] }
];

const lobbyOrder = (banner) =>
    banner.eventDate ? new Date(banner.eventDate).getTime() : Number.MAX_SAFE_INTEGER;

const formatDay = (timestamp) => moment.utc(timestamp).format('D MMM YYYY');

const clickTarget = (banner, events) => {
    if (banner.linkUrl) {
        try {
            const url = new URL(banner.linkUrl);
            return `Opens ${url.hostname.replace(/^www\./, '')}${url.pathname === '/' ? '' : url.pathname}`;
        } catch {
            return `Opens ${banner.linkUrl}`;
        }
    }

    if (banner.eventId) {
        const event = events?.find((e) => e._id === banner.eventId);

        return event ? `Starts a game for ${event.name}` : 'Starts a game for a deleted event';
    }

    return 'Not clickable';
};

const BannerRow = ({ banner, events, isEditing, isLocked, onEdit, onDelete }) => {
    const status = bannerStatus(banner);
    const lastDay = new Date(banner.showUntil).getTime() - 1;

    return (
        <li
            className={classNames(
                'flex flex-col gap-3 border-b border-gold-hair py-3 sm:flex-row sm:items-center sm:gap-5',
                isEditing && '-mx-3 bg-gold/[0.06] px-3'
            )}
        >
            {banner.image ? (
                <img
                    src={bannerImageUrl(banner.image)}
                    alt=''
                    className={classNames(
                        'aspect-[6/1] w-full shrink-0 border border-gold-hair object-cover sm:w-60',
                        status === 'Expired' && 'opacity-50 grayscale'
                    )}
                />
            ) : (
                <div className='flex aspect-[6/1] w-full shrink-0 items-center justify-center border border-dashed border-gold-line text-xs text-ink-faint sm:w-60'>
                    No image
                </div>
            )}
            <div className='min-w-0 flex-1'>
                <p className='text-ink'>{banner.title}</p>
                <p className='text-sm text-ink-dim'>{clickTarget(banner, events)}</p>
                <p className='mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-faint'>
                    <span className='inline-flex items-center gap-1.5'>
                        <span
                            aria-hidden='true'
                            className={classNames('size-1.5 rounded-full', StatusDots[status])}
                        />
                        <span className={status === 'No image' ? 'text-warning' : undefined}>
                            {StatusLabels[status]}
                        </span>
                    </span>
                    <span>
                        {formatDay(banner.showFrom)} to {formatDay(lastDay)}
                    </span>
                    {banner.eventDate && <span>Event on {formatDay(banner.eventDate)}</span>}
                </p>
            </div>
            <div className='flex shrink-0 gap-1'>
                <Button size='sm' variant='tertiary' isDisabled={isLocked} onPress={onEdit}>
                    Edit
                </Button>
                <Button
                    size='sm'
                    variant='ghost'
                    className='text-danger'
                    isDisabled={isLocked}
                    onPress={onDelete}
                >
                    Delete
                </Button>
            </div>
        </li>
    );
};

const BannersAdmin = () => {
    const { data: banners, isLoading, isError } = useGetAllBannersQuery();
    const { data: events } = useGetEventsQuery();
    const [deleteBanner] = useDeleteBannerMutation();
    const [editing, setEditing] = useState();
    const [deleting, setDeleting] = useState();
    const [showFinished, setShowFinished] = useState(false);
    const editorRef = useRef();

    const startEditing = (banner) => {
        setEditing(banner);
        requestAnimationFrame(() =>
            editorRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
        );
    };

    const onDelete = async (banner) => {
        try {
            await deleteBanner(banner._id).unwrap();
            toast.success('Banner deleted. The lobby can take up to a minute to catch up.');
        } catch (err) {
            toast.error(err?.data?.message || 'The banner could not be deleted. Try again later.');
        }
    };

    let content;
    if (isLoading) {
        content = <LoadingSpinner className='py-10' />;
    } else if (isError) {
        content = <Notice kind='error'>The banners couldn&apos;t be loaded.</Notice>;
    } else if (!banners?.length) {
        content = (
            <p className='py-6 text-center text-sm text-ink-dim'>
                No banners yet. Add one to promote an event in the lobby.
            </p>
        );
    } else {
        content = Sections.map((section) => {
            const items = banners
                .filter((banner) => section.statuses.includes(bannerStatus(banner)))
                .sort((a, b) =>
                    section.title === 'Finished'
                        ? new Date(b.showUntil) - new Date(a.showUntil)
                        : lobbyOrder(a) - lobbyOrder(b) ||
                          new Date(a.showUntil) - new Date(b.showUntil)
                );
            const isFinished = section.title === 'Finished';

            if (items.length === 0 && isFinished) {
                return null;
            }

            return (
                <Group
                    key={section.title}
                    title={`${section.title} (${items.length})`}
                    description={
                        section.title === 'Showing now'
                            ? 'In the lobby carousel, soonest event first.'
                            : undefined
                    }
                >
                    {isFinished && !showFinished ? (
                        <Button size='sm' variant='tertiary' onPress={() => setShowFinished(true)}>
                            Show finished banners
                        </Button>
                    ) : items.length === 0 ? (
                        <p className='text-sm text-ink-faint'>None.</p>
                    ) : (
                        <ul className='border-t border-gold-hair'>
                            {items.map((banner) => (
                                <BannerRow
                                    key={banner._id}
                                    banner={banner}
                                    events={events}
                                    isEditing={editing?._id === banner._id}
                                    isLocked={!!editing}
                                    onEdit={() => startEditing(banner)}
                                    onDelete={() => setDeleting(banner)}
                                />
                            ))}
                        </ul>
                    )}
                </Group>
            );
        });
    }

    return (
        <AdminPage
            section='banners'
            title='Banners'
            description='Promote community events at the top of the lobby. Each banner shows from its first day to its last and then hides itself. Changes can take up to a minute to reach the lobby.'
            actions={
                <Button
                    variant='primary'
                    isDisabled={!!editing}
                    onPress={() => startEditing('new')}
                >
                    Add banner
                </Button>
            }
        >
            {editing && (
                <div ref={editorRef} className='scroll-mt-4'>
                    <BannerEditor
                        key={editing === 'new' ? 'new' : editing._id}
                        banner={editing === 'new' ? undefined : editing}
                        onDone={() => setEditing(undefined)}
                    />
                </div>
            )}
            {content}
            <ConfirmDialog
                isOpen={!!deleting}
                isDestructive
                title='Delete this banner?'
                message={deleting?.title}
                okLabel='Delete'
                cancelLabel='Keep it'
                onOpenChange={(open) => !open && setDeleting(undefined)}
                onCancel={() => setDeleting(undefined)}
                onOk={() => {
                    onDelete(deleting);
                    setDeleting(undefined);
                }}
            />
        </AdminPage>
    );
};

export default BannersAdmin;
