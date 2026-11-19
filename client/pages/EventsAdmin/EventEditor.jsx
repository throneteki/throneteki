import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { Button, Spinner } from '@heroui/react';
import { Formik } from 'formik';
import * as yup from 'yup';
import { toast } from 'react-toastify';

import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import Notice from '../../Components/Site/Notice';
import { useGetEventQuery, useSaveEventMutation } from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';
import AdminPage from '../AdminPage';
import EventEditorForm, { EventFormId } from './EventEditorForm';

const schema = yup
    .object({
        name: yup.string().required('Event name is required'),
        format: yup.string().required('Format is required'),
        variant: yup.string().required('Variant is required'),
        legality: yup.string().required('Legality is required'),
        customLegality: yup.object().when('legality', {
            is: 'custom',
            then: (s) => s.required('Custom legality configuration is required'),
            otherwise: (s) => s.nullable().default(null)
        }),
        lockDecks: yup.boolean().default(false),
        useEventGameOptions: yup.boolean().default(false),
        eventGameOptions: yup
            .object({
                spectators: yup.boolean().default(false),
                muteSpectators: yup.boolean().default(false),
                showHand: yup.boolean().default(false),
                useGameTimeLimit: yup.boolean().default(false),
                gameTimeLimit: yup
                    .number()
                    .integer('Must be a whole number')
                    .min(10, 'Games must be at least 10 minutes long')
                    .max(120, 'Games must be less than 2 hours')
                    .when('useGameTimeLimit', {
                        is: true,
                        then: (s) => s.required('Game time limit is required'),
                        otherwise: (s) => s.nullable().default(null)
                    }),
                useChessClocks: yup.boolean().default(false),
                chessClockTimeLimit: yup
                    .number()
                    .integer('Must be a whole number')
                    .min(1, 'Clock must be at least 1 minute long')
                    .when('useChessClocks', {
                        is: true,
                        then: (s) => s.required('Chess clock time limit is required'),
                        otherwise: (s) => s.nullable().default(null)
                    }),
                chessClockDelay: yup
                    .number()
                    .min(0, 'Delay cannot be less than 0')
                    .when('useChessClocks', {
                        is: true,
                        then: (s) => s.required('Chess clock delay is required'),
                        otherwise: (s) => s.nullable().default(null)
                    }),
                password: yup.string(),
                maxPlayers: yup
                    .number()
                    .integer('Must be a whole number')
                    .min(2, 'Melee needs at least 2 players')
                    .max(8, 'Melee allows at most 8 players'),
                randomSeats: yup.boolean().when('format', {
                    is: 'melee',
                    then: (s) => s.required()
                }),
                allowMultipleWinners: yup.boolean().when('format', {
                    is: 'melee',
                    then: (s) => s.required()
                })
            })
            .when('useEventGameOptions', {
                is: true,
                then: (s) => s.required(),
                otherwise: (s) => s.nullable().default(null)
            }),
        restrictTableCreators: yup.boolean().default(false),
        validTableCreators: yup
            .array()
            .of(yup.string().required())
            .when('restrictTableCreators', {
                is: true,
                then: (s) => s.min(1, 'At least one valid creator is required').required(),
                otherwise: (s) => s.nullable().default(null)
            }),
        restrictSpectators: yup.boolean().default(false),
        validSpectators: yup
            .array()
            .of(yup.string().required())
            .when('restrictSpectators', {
                is: true,
                then: (s) => s.min(1, 'At least one valid spectator is required').required(),
                otherwise: (s) => s.nullable().default(null)
            })
    })
    .test('meleePlayers', function (values) {
        if (
            values.format === 'melee' &&
            values.useEventGameOptions &&
            values.eventGameOptions?.maxPlayers == null
        ) {
            return this.createError({
                path: 'eventGameOptions.maxPlayers',
                message: 'Set how many players each game has'
            });
        }

        return true;
    });

const EventEditor = ({ eventId }) => {
    const [saveEvent, { isLoading: isSaving }] = useSaveEventMutation();
    const { data: event, isLoading, error } = useGetEventQuery(eventId, { skip: !eventId });

    const dispatch = useDispatch();
    const backToEvents = useCallback(() => dispatch(navigate('/events')), [dispatch]);

    const initialValues = useMemo(() => {
        return {
            name: event?.name ?? '',
            format: event?.format ?? 'joust',
            variant: event?.variant,
            legality: event?.legality,
            gameType: event?.gameType ?? 'competitive',
            customLegality: event?.customLegality,
            lockDecks: event?.lockDecks ?? false,
            useEventGameOptions: event?.useEventGameOptions ?? false,
            eventGameOptions: {
                password: event?.eventGameOptions?.password ?? '',
                gamePrivate: event?.eventGameOptions?.gamePrivate ?? false,
                spectators: event?.eventGameOptions?.spectators ?? false,
                muteSpectators: event?.eventGameOptions?.muteSpectators ?? false,
                showHand: event?.eventGameOptions?.showHand ?? false,
                useGameTimeLimit: event?.eventGameOptions?.useGameTimeLimit ?? false,
                useChessClocks: event?.eventGameOptions?.useChessClocks ?? false,
                randomSeats: event?.eventGameOptions?.randomSeats ?? false,
                allowMultipleWinners: event?.eventGameOptions?.allowMultipleWinners ?? false,
                maxPlayers: event?.eventGameOptions?.maxPlayers ?? '',
                gameTimeLimit: event?.eventGameOptions?.gameTimeLimit ?? '',
                chessClockTimeLimit: event?.eventGameOptions?.chessClockTimeLimit ?? '',
                chessClockDelay: event?.eventGameOptions?.chessClockDelay ?? ''
            },
            restrictTableCreators: !!event?.validTableCreators,
            validTableCreators: event?.validTableCreators ?? [],
            restrictSpectators: !!event?.validSpectators,
            validSpectators: event?.validSpectators ?? []
        };
    }, [event]);

    const handleSubmit = useCallback(
        async (values) => {
            const { restrictTableCreators, restrictSpectators, ...rest } = values;
            const newEvent = {
                ...rest,
                validTableCreators: restrictTableCreators ? values.validTableCreators : null,
                validSpectators: restrictSpectators ? values.validSpectators : null
            };
            if (eventId) newEvent._id = eventId;
            try {
                await saveEvent(newEvent).unwrap();
                backToEvents();
                toast.success(eventId ? 'Event saved' : 'Event created');
            } catch (err) {
                toast.error(err?.data?.message || 'The event could not be saved. Try again later.');
            }
        },
        [backToEvents, eventId, saveEvent]
    );

    const pageProps = {
        section: 'events',
        title: eventId ? event?.name || 'Edit event' : 'New event',
        description: eventId
            ? 'Changes apply to games created from now on; games already running keep the old settings.'
            : 'Set the format, card list and rules every game in the event will use.',
        actions: (
            <Button variant='tertiary' onPress={backToEvents}>
                All events
            </Button>
        )
    };

    if (isLoading) {
        return (
            <AdminPage {...pageProps}>
                <LoadingSpinner className='py-10' />
            </AdminPage>
        );
    }

    if (error || (eventId && !event)) {
        return (
            <AdminPage {...pageProps}>
                <Notice kind='error'>
                    {error?.data?.message || 'The event couldn’t be loaded.'}
                </Notice>
            </AdminPage>
        );
    }

    return (
        <Formik
            validationSchema={schema}
            onSubmit={handleSubmit}
            initialValues={initialValues}
            enableReinitialize
        >
            {({ isSubmitting }) => (
                <AdminPage
                    {...pageProps}
                    footer={
                        <div className='flex flex-wrap items-center justify-end gap-2'>
                            <Button variant='tertiary' onPress={backToEvents}>
                                Cancel
                            </Button>
                            <Button
                                type='submit'
                                form={EventFormId}
                                variant='primary'
                                isPending={isSaving || isSubmitting}
                            >
                                {(isSaving || isSubmitting) && (
                                    <Spinner color='current' size='sm' />
                                )}
                                {eventId ? 'Save changes' : 'Create event'}
                            </Button>
                        </div>
                    }
                >
                    <EventEditorForm />
                </AdminPage>
            )}
        </Formik>
    );
};

export default EventEditor;
