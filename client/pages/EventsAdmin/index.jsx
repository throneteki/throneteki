import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import Panel from '../../Components/Site/Panel';
import {
    useDeleteDraftCubeMutation,
    useDeleteEventMutation,
    useGetDraftCubesQuery,
    useGetEventsQuery
} from '../../redux/middleware/api';
import { toastr } from 'react-redux-toastr';
import { navigate } from '../../redux/reducers/navigation';
import {
    Button,
    Table,
    TableBody,
    TableCell,
    TableColumn,
    TableHeader,
    TableRow
} from '@nextui-org/react';

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

                toastr.success('Success', 'Event deleted successfully');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error('Error', err || 'An error occurred deleting the event');
            }
        },
        [deleteEvent]
    );

    const handleDeleteDraftCubeClick = useCallback(
        async (id) => {
            try {
                await deleteDraftCube(id).unwrap();

                toastr.success('Success', 'Draft cube deleted successfully');

                setTimeout(() => {
                    toastr.clean();
                }, 5000);
            } catch (err) {
                toastr.error('Error', err || 'An error occurred deleting the draft cube');
            }
        },
        [deleteDraftCube]
    );

    const renderedDraftCubes = useMemo(() => {
        {
            draftCubes &&
                draftCubes.map((draftCube) => (
                    <tr key={`draft-cube:${draftCubes.name}`}>
                        <td>{draftCube.name}</td>
                        <td>
                            <button
                                className='btn btn-primary'
                                onClick={() =>
                                    dispatch(navigate(`/events/draft-cubes/${draftCube._id}`))
                                }
                            >
                                Edit
                            </button>
                            <button
                                className='btn btn-danger'
                                onClick={() => handleDeleteDraftCubeClick(draftCube._id)}
                            >
                                Delete{' '}
                                {isDeleteDraftCubeLoading && (
                                    <span className='spinner button-spinner' />
                                )}
                            </button>
                        </td>
                    </tr>
                ));
        }
    }, [dispatch, draftCubes, handleDeleteDraftCubeClick, isDeleteDraftCubeLoading]);

    if (isEventsLoading || isDraftCubesLoading) {
        return 'Loading events, please wait...';
    }

    return (
        <div className='w-full'>
            <Panel title='Events administration'>
                <div>
                    <Button color='primary' onClick={() => dispatch(navigate('/events/add'))}>
                        Add event
                    </Button>
                </div>
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
                                            onClick={() =>
                                                dispatch(navigate(`/events/${event._id}`))
                                            }
                                        >
                                            Edit
                                        </Button>
                                        <Button
                                            color='danger'
                                            isLoading={isDeleteEventLoading}
                                            onClick={() => handleDeleteClick(event._id)}
                                        >
                                            Delete
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Panel>
            <Panel title='Draft Cubes'>
                <a
                    className='btn btn-primary'
                    onClick={() => dispatch(navigate('/events/draft-cubes/add'))}
                >
                    Add draft cube
                </a>
                <table className='table table-striped'>
                    <thead>
                        <tr>
                            <th className='col-sm-2'>Draft Cube</th>
                            <th className='col-sm-2'>Action</th>
                        </tr>
                    </thead>
                    <tbody>{renderedDraftCubes}</tbody>
                </table>
            </Panel>
        </div>
    );
};

export default EventsAdmin;
