import React, { useCallback } from 'react';
import { useDispatch } from 'react-redux';
import Panel from '../../Components/Site/Panel';
import {
    useDeleteDraftCubeMutation,
    useDeleteEventMutation,
    useGetDraftCubesQuery,
    useGetEventsQuery
} from '../../redux/middleware/api';
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

const EventsAdmin = () => {
    const dispatch = useDispatch();

    const { data: events, isLoading: isEventsLoading } = useGetEventsQuery();
    const { data: draftCubes, isLoading: isDraftCubesLoading } = useGetDraftCubesQuery();
    const [deleteEvent, { isLoading: isDeleteEventLoading }] = useDeleteEventMutation();
    const [deleteDraftCube, { isLoading: isDeleteDraftCubeLoading }] = useDeleteDraftCubeMutation();

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

    const handleDeleteDraftCubeClick = useCallback(
        async (id) => {
            try {
                await deleteDraftCube(id).unwrap();

                toast.success('Draft cube deleted successfully');
            } catch (err) {
                toast.error('Error', err || 'An error occurred deleting the draft cube');
            }
        },
        [deleteDraftCube]
    );

    if (isEventsLoading || isDraftCubesLoading) {
        return <LoadingSpinner label='Loading events...' />;
    }

    return (
        <div className='m-2 lg:mx-auto lg:w-4/5 flex flex-col gap-2'>
            <Panel title='Events administration'>
                <div className='flex flex-col gap-2'>
                    <Button
                        color='primary'
                        className='self-start'
                        onPress={() => dispatch(navigate('/events/add'))}
                    >
                        Add event
                    </Button>
                    <Table isStriped>
                        <TableHeader>
                            <TableColumn>Event</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {events.map((event, index) => (
                                <TableRow key={index}>
                                    <TableCell>{event.name}</TableCell>
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
            <Panel title='Draft Cubes'>
                <div className='flex flex-col gap-2'>
                    <Button
                        color='primary'
                        className='self-start'
                        onPress={() => dispatch(navigate('/events/draft-cubes/add'))}
                    >
                        Add draft cube
                    </Button>
                    <Table isStriped>
                        <TableHeader>
                            <TableColumn>Draft Cube</TableColumn>
                            <TableColumn>Action</TableColumn>
                        </TableHeader>
                        <TableBody>
                            {draftCubes.map((draftCube, index) => (
                                <TableRow key={index}>
                                    <TableCell>{draftCube.name}</TableCell>
                                    <TableCell>
                                        <div className='flex gap-2'>
                                            <Button
                                                color='primary'
                                                onPress={() =>
                                                    dispatch(
                                                        navigate(
                                                            `/events/draft-cubes/${draftCube._id}`
                                                        )
                                                    )
                                                }
                                            >
                                                Edit
                                            </Button>
                                            <Button
                                                color='danger'
                                                isLoading={isDeleteDraftCubeLoading}
                                                onPress={() =>
                                                    handleDeleteDraftCubeClick(draftCube._id)
                                                }
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
        </div>
    );
};

export default EventsAdmin;
