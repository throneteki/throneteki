import React, { useCallback, useMemo } from 'react';
import { useDispatch } from 'react-redux';
import { useGetEventQuery, useSaveEventMutation } from '../../redux/middleware/api';
import Panel from '../../Components/Site/Panel';
import AlertPanel from '../../Components/Site/AlertPanel';
import { navigate } from '../../redux/reducers/navigation';
import { Button, Input, Switch, Textarea } from '@heroui/react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import Page from '../Page';
import CustomLegalityEditor from './CustomLegalityEditor';
import { Formik, getIn, setNestedObjectValues, useFormikContext } from 'formik';
import * as yup from 'yup';
import FormatSelect from '../../Components/Games/FormatSelect';
import VariantSelect from '../../Components/Games/VariantSelect';
import LegalitySelect from '../../Components/Games/LegalitySelect';

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
            password: yup.string().nullable().optional(),
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
            legality: typeof event?.legality === 'object' ? 'custom' : event?.legality,
            customLegality: typeof event?.legality === 'object' ? event.legality : null,
            lockDecks: event?.lockDecks ?? false,
            useEventGameOptions: event?.useEventGameOptions ?? false,
            eventGameOptions: event?.eventGameOptions ?? {
                spectators: false,
                muteSpectators: false,
                showHand: false,
                useGameTimeLimit: false,
                useChessClocks: false,
                randomSeats: false,
                allowMultipleWinners: false
            },
            restrictTableCreators: !!event?.validTableCreators,
            validTableCreators: event?.validTableCreators ?? [],
            restrictSpectators: !!event?.validSpectators,
            validSpectators: event?.validSpectators ?? []
        };
    }, [event]);

    const handleSubmit = useCallback(
        async (values) => {
            const { customLegality, restrictTableCreators, restrictSpectators, ...rest } = values;
            const newEvent = {
                ...rest,
                legality: values.legality === 'custom' ? customLegality : values.legality,
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

const getUsernameList = (value) =>
    value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

const EventEditorForm = ({ isNew, isSaving, dispatch }) => {
    const {
        values,
        errors,
        touched,
        isSubmitting,
        validateForm,
        setTouched,
        submitForm,
        handleChange,
        getFieldProps,
        setFieldValue
    } = useFormikContext();

    const handleFormatChange = useCallback(
        (newFormat) => {
            setFieldValue('format', newFormat);
        },
        [setFieldValue]
    );

    const handleVariantChange = useCallback(
        (newVariant) => {
            setFieldValue('variant', newVariant);
        },
        [setFieldValue]
    );

    const handleLegalityChange = useCallback(
        (newLegality) => {
            setFieldValue('legality', newLegality);
            if (newLegality !== 'custom') {
                setFieldValue('customLegality', null);
            }
        },
        [setFieldValue]
    );

    const handleSetCustomLegality = useCallback(
        (val) => setFieldValue('customLegality', { name: 'Custom', ...val }),
        [setFieldValue]
    );

    const getValidationProps = useCallback(
        (fieldName) => {
            const error = getIn(errors, fieldName);
            const touch = getIn(touched, fieldName);

            return {
                isInvalid: !!touch && !!error,
                errorMessage: error
            };
        },
        [errors, touched]
    );

    return (
        <form
            className='flex gap-2 flex-col'
            onSubmit={async (e) => {
                e.preventDefault();
                // Working around Formik bug of not marking nested object (like eventGameOptions.x) as touched on submit
                const errors = await validateForm();
                setTouched(setNestedObjectValues(errors, true));
                if (Object.keys(errors).length === 0) {
                    submitForm();
                }
            }}
        >
            <Panel title='Event Details'>
                <div className='flex gap-2 flex-col'>
                    <div className='flex flex-col md:flex-row gap-2 items-center'>
                        <Input
                            label='Event Name'
                            placeholder='Event Name'
                            type='text'
                            {...getFieldProps('name')}
                            {...getValidationProps('name')}
                        />
                        <FormatSelect
                            label='Format'
                            selected={values.format}
                            onSelected={handleFormatChange}
                            {...getValidationProps('format')}
                            disallowEmptySelection
                        />
                        <VariantSelect
                            label='Variant'
                            format={values.format}
                            selected={values.variant}
                            onSelected={handleVariantChange}
                            {...getValidationProps('variant')}
                            disallowEmptySelection
                        />
                        <LegalitySelect
                            label='Legality'
                            format={values.format}
                            variant={values.variant}
                            selected={values.legality}
                            onSelected={handleLegalityChange}
                            {...getValidationProps('legality')}
                            disallowEmptySelection
                            allowCustom
                        />
                    </div>
                    <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                        <div className='flex flex-col gap-1'>
                            <Switch
                                name='lockDecks'
                                onChange={handleChange}
                                isSelected={values.lockDecks}
                            >
                                Lock decks for this event
                            </Switch>
                            <div>
                                Locks in the first deck a player chooses &amp; plays under this
                                event - future games will force the same deck to be chosen.
                            </div>
                        </div>
                        <div className='flex flex-col gap-1'>
                            <Switch
                                name='useEventGameOptions'
                                onChange={handleChange}
                                isSelected={values.useEventGameOptions}
                            >
                                Custom Game Options
                            </Switch>
                            <div>Forces specific game options for games under this event.</div>
                        </div>
                    </div>
                </div>
            </Panel>

            {values.useEventGameOptions && (
                <Panel title='Event Game Options'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                        <Input
                            label='Password'
                            placeholder='Password'
                            type='text'
                            {...getFieldProps('eventGameOptions.password')}
                            {...getValidationProps('eventGameOptions.password')}
                        />
                        <div>
                            <Switch
                                name='eventGameOptions.spectators'
                                onChange={handleChange}
                                isSelected={values.eventGameOptions?.spectators}
                            >
                                Allow spectators
                            </Switch>
                            {values.eventGameOptions?.spectators && (
                                <div className='flex flex-col gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                    <Switch
                                        name='eventGameOptions.muteSpectators'
                                        onChange={handleChange}
                                        isSelected={values.eventGameOptions?.muteSpectators}
                                    >
                                        Mute spectators
                                    </Switch>
                                    <Switch
                                        name='eventGameOptions.showHand'
                                        onChange={handleChange}
                                        isSelected={values.eventGameOptions?.showHand}
                                    >
                                        Show hands to spectators
                                    </Switch>
                                </div>
                            )}
                        </div>
                        <div>
                            <Switch
                                name='eventGameOptions.useGameTimeLimit'
                                onChange={handleChange}
                                isSelected={values.eventGameOptions?.useGameTimeLimit}
                            >
                                Use game time limit
                            </Switch>
                            {values.eventGameOptions?.useGameTimeLimit && (
                                <div className='border-l-1 pl-2 pt-2 border-default-200'>
                                    <Input
                                        label='Limit (minutes)'
                                        type='number'
                                        {...getFieldProps('eventGameOptions.gameTimeLimit')}
                                        {...getValidationProps('eventGameOptions.gameTimeLimit')}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <Switch
                                name='eventGameOptions.useChessClocks'
                                onChange={handleChange}
                                isSelected={values.eventGameOptions?.useChessClocks}
                            >
                                Use chess clocks (time limit per player)
                            </Switch>
                            {values.eventGameOptions?.useChessClocks && (
                                <div className='flex flex-row gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                    <Input
                                        label='Limit (minutes)'
                                        type='number'
                                        {...getFieldProps('eventGameOptions.chessClockTimeLimit')}
                                        {...getValidationProps(
                                            'eventGameOptions.chessClockTimeLimit'
                                        )}
                                    />
                                    <Input
                                        label='Delay (seconds)'
                                        type='number'
                                        {...getFieldProps('eventGameOptions.chessClockDelay')}
                                        {...getValidationProps('eventGameOptions.chessClockDelay')}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                    {values.format === 'melee' && (
                        <div className='my-2 border-t-1 border-default-200'>
                            <h2 className='text-lg py-2 font-bold'>Melee Options</h2>
                            <div className='grid grid-cols-1 md:grid-cols-2 gap-2'>
                                <Switch
                                    name='eventGameOptions.randomSeats'
                                    onChange={handleChange}
                                    isSelected={values.eventGameOptions?.randomSeats}
                                >
                                    Random Seats
                                </Switch>
                                <Switch
                                    name='eventGameOptions.allowMultipleWinners'
                                    onChange={handleChange}
                                    isSelected={values.eventGameOptions?.allowMultipleWinners}
                                >
                                    Allow Multiple Winners
                                </Switch>
                            </div>
                        </div>
                    )}
                </Panel>
            )}

            <Panel title='Settings for Judges/Streamers'>
                <div className='grid grid-cols-1 sm:grid-cols-2 gap-2'>
                    <div className='flex flex-col gap-1'>
                        <Switch
                            name='restrictTableCreators'
                            onChange={handleChange}
                            isSelected={values.restrictTableCreators}
                        >
                            Enable creator whitelist
                        </Switch>
                        {values.restrictTableCreators && (
                            <>
                                <div>Separate username per line</div>
                                <Textarea
                                    label='Valid Creators'
                                    rows='10'
                                    value={values.validTableCreators?.join('\n') ?? ''}
                                    onValueChange={(value) =>
                                        setFieldValue('validTableCreators', getUsernameList(value))
                                    }
                                    isInvalid={
                                        !!(errors.validTableCreators && touched.validTableCreators)
                                    }
                                    errorMessage={errors.validTableCreators}
                                />
                            </>
                        )}
                    </div>
                    <div className='flex flex-col gap-1'>
                        <Switch
                            name='restrictSpectators'
                            onChange={handleChange}
                            isSelected={values.restrictSpectators}
                        >
                            Enable spectator whitelist
                        </Switch>
                        {values.restrictSpectators && (
                            <>
                                <div>Separate username per line</div>
                                <Textarea
                                    label='Valid Spectators'
                                    rows='10'
                                    value={values.validSpectators?.join('\n') ?? ''}
                                    onValueChange={(value) =>
                                        setFieldValue('validSpectators', getUsernameList(value))
                                    }
                                    isInvalid={
                                        !!(errors.validSpectators && touched.validSpectators)
                                    }
                                    errorMessage={errors.validSpectators}
                                />
                            </>
                        )}
                    </div>
                </div>
            </Panel>

            {values.legality === 'custom' && (
                <CustomLegalityEditor
                    format={values.format}
                    variant={values.variant}
                    legality={values.customLegality}
                    setLegality={handleSetCustomLegality}
                />
            )}

            <div className='flex gap-2'>
                <Button isLoading={isSaving || isSubmitting} color='success' type='submit'>
                    {isNew ? 'Create' : 'Save'}
                </Button>
                <Button color='primary' onPress={() => dispatch(navigate('/events'))}>
                    Back
                </Button>
            </div>
        </form>
    );
};

export default EventEditor;
