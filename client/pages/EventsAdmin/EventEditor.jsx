import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useGetEventQuery, useSaveEventMutation } from '../../redux/middleware/api';
import Panel from '../../Components/Site/Panel';
import AlertPanel from '../../Components/Site/AlertPanel';
import { navigate } from '../../redux/reducers/navigation';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import Page from '../Page';
import { Formik } from 'formik';
import * as yup from 'yup';
import EventEditorForm from './EventEditorForm';

const schema = yup.object({
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
            maxPlayers: yup.number().when('format', {
                is: 'melee',
                then: (s) =>
                    s
                        .required('You must specify a number of players')
                        .min(2, 'Melee must have at least 2 players')
                        .max(8, 'Melee cannot have more than 8 players')
            }),
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
});

const EventEditor = ({ eventId }) => {
    const [saveEvent, { isLoading: isSaving }] = useSaveEventMutation();
    const { data: event, isLoading, error } = useGetEventQuery(eventId, { skip: !eventId });

    const dispatch = useDispatch();

    const initialValues = useMemo(() => {
        return {
            name: event?.name ?? '',
            format: event?.format ?? 'joust',
            variant: event?.variant,
            legality: event?.legality,
            gameType: 'competitive',
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
                validTableCreators: restrictTableCreators ? values.validTableCreators : undefined,
                validSpectators: restrictSpectators ? values.validSpectators : undefined
            };
            if (eventId) newEvent._id = eventId;
            try {
                await saveEvent(newEvent).unwrap();
                dispatch(navigate('/events'));
                toast.success('Event saved successfully');
            } catch (err) {
                toast.error('Error saving event');
            }
        },
        [dispatch, eventId, saveEvent]
    );

    if (isLoading) {
        return <LoadingSpinner />;
    }

    if (error) {
        return (
            <AlertPanel
                variant='danger'
                message={error.data?.message || 'An error occurred loading the event'}
            />
        );
    }

    return (
        <Page>
            <Panel title='Event Editor'>
                <Formik
                    validationSchema={schema}
                    onSubmit={handleSubmit}
                    initialValues={initialValues}
                    enableReinitialize
                >
                    <EventEditorForm isNew={!eventId} isSaving={isSaving} dispatch={dispatch} />
                </Formik>
            </Panel>
        </Page>
    );
};

export default EventEditor;
