import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Panel from '../../Components/Site/Panel';
import { useDeleteEventMutation, useGetEventsQuery } from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@heroui/react';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import { toast } from 'react-toastify';
import Page from '../Page';
import { GameFormats } from '../../constants';

const EventsAdmin = () => {
    const dispatch = useDispatch();

    const { data: events, isLoading: isEventsLoading } = useGetEventsQuery();
    const [deleteEvent, { isLoading: isDeleteEventLoading }] = useDeleteEventMutation();

    const handleDeleteClick = useCallback(
        async (id) => {
            try {
                await deleteEvent(id).unwrap();

                toast.success('Event deleted successfully');
            } catch (err) {
                toast.error('Error', err || 'An error occurred deleting the event');
            }
        },
        [deleteEvent]
    );

    if (isEventsLoading) {
        return <LoadingSpinner label='Loading events...' />;
    }

    return (
        <Page>
            <Panel title='Events Administration'>
                <div className='flex flex-col gap-2'>
                    <Button
                        color='primary'
                        className='self-start'
                        onPress={() => dispatch(navigate('/events/add'))}
                    >
                        Add event
                    </Button>
                    <Table isStriped aria-label='Events Table'>
                        <TableHeader>
                            <TableColumn>Name</TableColumn>
                            <TableColumn>Format</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {events.map((event, index) => (
                                <TableRow key={index}>
                                    <TableCell>{event.name}</TableCell>
                                    <TableCell>
                                        {GameFormats.find((gf) => gf.name === event.format)?.label}
                                    </TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button
                                                color='primary'
                                                onPress={() =>
                                                    dispatch(navigate(`/events/${event._id}`))
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color='danger'
                                                isLoading={isDeleteEventLoading}
                                                onPress={() => handleDeleteClick(event._id)}
                                            >
                                                Delete
                                            </Button>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </Panel>
        </Page>
    );
};

export default EventsAdmin;
