import React, { useState } from 'react';
import moment from 'moment';
import {
    Button,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@heroui/react';
import { toast } from 'react-toastify';
import Panel from '../Components/Site/Panel';
import LoadingSpinner from '../Components/Site/LoadingSpinner';
import AlertPanel from '../Components/Site/AlertPanel';
import ConfirmDialog from '../Components/Site/ConfirmDialog';
import BannerEditor from '../Components/Banners/BannerEditor';
import { bannerStatus } from '../Components/Banners/bannerDates';
import { bannerImageUrl } from '../util';
import {
    useDeleteBannerMutation,
    useGetAllBannersQuery,
    useGetEventsQuery
} from '../redux/middleware/api';
import Page from './Page';

const StatusColours = {
    Live: 'success',
    Scheduled: 'primary',
    'No image': 'warning',
    Expired: 'default'
};

const formatDay = (timestamp) => moment.utc(timestamp).format('D MMM YYYY');

const clickTarget = (banner, events) => {
    if (banner.linkUrl) {
        return new URL(banner.linkUrl).hostname;
    }

    if (banner.eventId) {
        const event = events?.find((e) => e._id === banner.eventId);

        return `Play: ${event?.name ?? 'event'}`;
    }

    return 'Nothing';
};

const BannersAdmin = () => {
    const { data: banners, isLoading, isError } = useGetAllBannersQuery();
    const { data: events } = useGetEventsQuery();
    const [deleteBanner] = useDeleteBannerMutation();
    const [editing, setEditing] = useState();
    const [deleting, setDeleting] = useState();

    const onDelete = async () => {
        try {
            await deleteBanner(deleting._id).unwrap();
            toast.success('Banner deleted. The lobby can take up to a minute to show changes.');
        } catch (err) {
            toast.error(err?.data?.message || 'An error occurred deleting the banner');
        }
    };

    let content;
    if (isLoading) {
        content = <LoadingSpinner label='Loading banners...' />;
    } else if (isError) {
        content = <AlertPanel variant='danger'>The banners could not be loaded</AlertPanel>;
    } else {
        content = (
            <Table isStriped aria-label='Banners'>
                <TableHeader>
                    <TableColumn>Image</TableColumn>
                    <TableColumn>Title</TableColumn>
                    <TableColumn>When clicked</TableColumn>
                    <TableColumn>Event date</TableColumn>
                    <TableColumn>Shown</TableColumn>
                    <TableColumn>Status</TableColumn>
                    <TableColumn>Actions</TableColumn>
                </TableHeader>
                <TableBody emptyContent='No banners yet'>
                    {banners.map((banner) => {
                        const status = bannerStatus(banner);

                        return (
                            <TableRow key={banner._id}>
                                <TableCell>
                                    {banner.image ? (
                                        <img
                                            src={bannerImageUrl(banner.image)}
                                            alt=''
                                            className='aspect-[6/1] w-36 rounded object-cover'
                                        />
                                    ) : (
                                        <span className='text-default-500'>None</span>
                                    )}
                                </TableCell>
                                <TableCell>{banner.title}</TableCell>
                                <TableCell>{clickTarget(banner, events)}</TableCell>
                                <TableCell>
                                    {banner.eventDate ? formatDay(banner.eventDate) : 'None'}
                                </TableCell>
                                <TableCell>
                                    {formatDay(banner.showFrom)} to{' '}
                                    {formatDay(new Date(banner.showUntil).getTime() - 1)}
                                </TableCell>
                                <TableCell>
                                    <Chip size='sm' variant='flat' color={StatusColours[status]}>
                                        {status}
                                    </Chip>
                                </TableCell>
                                <TableCell>
                                    <div className='flex gap-2'>
                                        <Button
                                            size='sm'
                                            color='primary'
                                            isDisabled={!!editing}
                                            onPress={() => setEditing(banner)}
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            size='sm'
                                            color='danger'
                                            isDisabled={!!editing}
                                            onPress={() => setDeleting(banner)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        );
    }

    return (
        <Page>
            {editing && (
                <BannerEditor
                    key={editing === 'new' ? 'new' : editing._id}
                    banner={editing === 'new' ? undefined : editing}
                    onDone={() => setEditing(undefined)}
                />
            )}
            <Panel title='Event banners'>
                <div className='flex flex-col gap-2'>
                    <p className='text-sm text-default-500'>
                        Banners promote upcoming community events at the top of the lobby. Each one
                        is shown between its start and end days and then hidden automatically.
                        Banners without an image are not shown, and changes can take up to a minute
                        to reach the lobby.
                    </p>
                    <Button
                        color='primary'
                        className='self-start'
                        isDisabled={!!editing}
                        onPress={() => setEditing('new')}
                    >
                        Add banner
                    </Button>
                    {content}
                </div>
            </Panel>
            <ConfirmDialog
                isOpen={!!deleting}
                onOpenChange={(open) => !open && setDeleting(undefined)}
                message={deleting && `Delete the banner "${deleting.title}"?`}
                onOk={onDelete}
                onCancel={() => setDeleting(undefined)}
            />
        </Page>
    );
};

export default BannersAdmin;
