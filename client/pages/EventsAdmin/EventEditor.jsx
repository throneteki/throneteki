import { useCallback, useMemo } from 'react';

import { useDispatch } from 'react-redux';
import {
    useGetEventQuery,
    useGetRestrictedListQuery,
    useSaveEventMutation
} from '../../redux/middleware/api';
import Panel from '../../Components/Site/Panel';
import AlertPanel from '../../Components/Site/AlertPanel';
import { navigate } from '../../redux/reducers/navigation';
import { Button, Input, Select, SelectItem, Switch, Textarea } from '@heroui/react';
import { toast } from 'react-toastify';
import LoadingSpinner from '../../Components/Site/LoadingSpinner';
import Page from '../Page';
import { GameFormats } from '../../constants';
import CustomLegalityEditor from './CustomLegalityEditor';
import { Formik } from 'formik';
import * as yup from 'yup';

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
    password: yup.string().optional(),
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

const getUsernameList = (value) =>
    value
        .split('\n')
        .map((s) => s.trim())
        .filter(Boolean);

const getDefaultLegality = (format, variant, lists) => {
    const hasActive = lists?.some(
        (rl) => rl.format === format && rl.variant === variant && rl.active
    );
    return hasActive ? 'latest' : 'custom';
};

const EventEditorForm = ({ isNew, formProps, allRestrictedLists, isSaveLoading, dispatch }) => {
    const { values, errors, touched, handleChange, getFieldProps, setFieldValue, handleSubmit } =
        formProps;

    const formats = useMemo(() => GameFormats.map(({ name, label }) => ({ name, label })), []);

    const variants = useMemo(
        () => GameFormats.find(({ name }) => name === values.format)?.variants ?? [],
        [values.format]
    );

    const legalities = useMemo(() => {
        if (!values.format || !values.variant) return [];
        const latestActive = allRestrictedLists.find(
            (rl) => rl.format === values.format && rl.variant === values.variant && rl.active
        );
        return [
            { _id: 'custom', label: 'Custom' },
            ...(latestActive && [{ _id: 'latest', label: `Latest (${latestActive.version})` }]),
            ...(allRestrictedLists
                ?.filter((rl) => rl.format === values.format && rl.variant === values.variant)
                .map((rl) => ({
                    label: `${rl.version}${rl.active ? ' (Active)' : ''}`,
                    ...rl
                })) ?? [])
        ];
    }, [allRestrictedLists, values.format, values.variant]);

    const handleFormatChange = (e) => {
        const newFormat = e.target.value;
        const newVariant =
            GameFormats.find(({ name }) => name === newFormat)?.variants?.[0]?.name ?? null;
        setFieldValue('format', newFormat);
        setFieldValue('variant', newVariant);
        setFieldValue('legality', getDefaultLegality(newFormat, newVariant, allRestrictedLists));
        setFieldValue('customLegality', null);
    };

    const handleVariantChange = (e) => {
        const newVariant = e.target.value;
        setFieldValue('variant', newVariant);
        setFieldValue(
            'legality',
            getDefaultLegality(values.format, newVariant, allRestrictedLists)
        );
        setFieldValue('customLegality', null);
    };

    const handleSetCustomLegality = useCallback(
        (val) => setFieldValue('customLegality', val),
        [setFieldValue]
    );

    return (
        <form
            className='flex gap-2 flex-col'
            onSubmit={(e) => {
                e.preventDefault();
                handleSubmit(values);
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
                            isInvalid={!!(errors.name && touched.name)}
                            errorMessage={errors.name}
                        />
                        <Select
                            label='Format'
                            selectedKeys={values.format ? [values.format] : []}
                            onChange={handleFormatChange}
                            isInvalid={!!(errors.format && touched.format)}
                            errorMessage={errors.format}
                            disallowEmptySelection
                        >
                            {formats.map((f) => (
                                <SelectItem key={f.name} value={f.name}>
                                    {f.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label='Variant'
                            selectedKeys={values.variant ? [values.variant] : []}
                            onChange={handleVariantChange}
                            isDisabled={variants.length === 0}
                            isInvalid={!!(errors.variant && touched.variant)}
                            errorMessage={errors.variant}
                            disallowEmptySelection
                        >
                            {variants.map((v) => (
                                <SelectItem key={v.name} value={v.name}>
                                    {v.label}
                                </SelectItem>
                            ))}
                        </Select>
                        <Select
                            label='Legality'
                            selectedKeys={values.legality ? [values.legality] : []}
                            onChange={(e) => setFieldValue('legality', e.target.value)}
                            isDisabled={legalities.length === 0}
                            isInvalid={!!(errors.legality && touched.legality)}
                            errorMessage={errors.legality}
                            disallowEmptySelection
                        >
                            {legalities.map((l) => (
                                <SelectItem key={l._id} value={l._id} textValue={l.label}>
                                    <div className='flex flex-col'>
                                        <span className='text-md'>{l.label}</span>
                                        <span className='text-xs'>{l.issuer}</span>
                                    </div>
                                </SelectItem>
                            ))}
                        </Select>
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
                        <div>
                            <Switch
                                name='spectators'
                                onChange={handleChange}
                                isSelected={values.spectators}
                            >
                                Allow spectators
                            </Switch>
                            {values.spectators && (
                                <div className='flex flex-col gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                    <Switch
                                        name='muteSpectators'
                                        onChange={handleChange}
                                        isSelected={values.muteSpectators}
                                    >
                                        Mute spectators
                                    </Switch>
                                    <Switch
                                        name='showHand'
                                        onChange={handleChange}
                                        isSelected={values.showHand}
                                    >
                                        Show hands to spectators
                                    </Switch>
                                </div>
                            )}
                        </div>
                        <div>
                            <Switch
                                name='useGameTimeLimit'
                                onChange={handleChange}
                                isSelected={values.useGameTimeLimit}
                            >
                                Use game time limit
                            </Switch>
                            {values.useGameTimeLimit && (
                                <div className='border-l-1 pl-2 pt-2 border-default-200'>
                                    <Input
                                        label='Limit (minutes)'
                                        type='number'
                                        {...getFieldProps('gameTimeLimit')}
                                        isInvalid={
                                            !!(errors.gameTimeLimit && touched.gameTimeLimit)
                                        }
                                        errorMessage={errors.gameTimeLimit}
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <Switch
                                name='useChessClocks'
                                onChange={handleChange}
                                isSelected={values.useChessClocks}
                            >
                                Use chess clocks (time limit per player)
                            </Switch>
                            {values.useChessClocks && (
                                <div className='flex flex-row gap-2 border-l-1 pl-2 pt-2 border-default-200'>
                                    <Input
                                        label='Limit (minutes)'
                                        type='number'
                                        {...getFieldProps('chessClockTimeLimit')}
                                        isInvalid={
                                            !!(
                                                errors.chessClockTimeLimit &&
                                                touched.chessClockTimeLimit
                                            )
                                        }
                                        errorMessage={errors.chessClockTimeLimit}
                                    />
                                    <Input
                                        label='Delay (seconds)'
                                        type='number'
                                        {...getFieldProps('chessClockDelay')}
                                        isInvalid={
                                            !!(errors.chessClockDelay && touched.chessClockDelay)
                                        }
                                        errorMessage={errors.chessClockDelay}
                                    />
                                </div>
                            )}
                        </div>
                        <Input
                            label='Password'
                            placeholder='Password'
                            type='text'
                            {...getFieldProps('password')}
                            isInvalid={!!(errors.password && touched.password)}
                            errorMessage={errors.password}
                        />
                    </div>
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
                <Button isLoading={isSaveLoading} color='success' type='submit'>
                    {isNew ? 'Create' : 'Save'}
                </Button>
                <Button color='primary' onPress={() => dispatch(navigate('/events'))}>
                    Back
                </Button>
            </div>
        </form>
    );
};

const EventEditor = ({ eventId }) => {
    const { data: allRestrictedLists, isLoading: isRestrictedListsLoading } =
        useGetRestrictedListQuery();
    const [saveEvent, { isLoading: isSaveLoading }] = useSaveEventMutation();
    const { data: event, isLoading, error } = useGetEventQuery(eventId, { skip: !eventId });

    const dispatch = useDispatch();

    const initialValues = useMemo(() => {
        const defaultFormat = event?.format ?? 'joust';
        const defaultVariant =
            event?.variant ??
            GameFormats.find(({ name }) => name === defaultFormat)?.variants?.[0]?.name ??
            null;
        const defaultLegality =
            typeof event?.legality === 'object'
                ? 'custom'
                : (event?.legality ??
                  getDefaultLegality(defaultFormat, defaultVariant, allRestrictedLists));

        return {
            name: event?.name ?? '',
            format: defaultFormat,
            variant: defaultVariant,
            legality: defaultLegality,
            customLegality: typeof event?.legality === 'object' ? event.legality : {},
            lockDecks: event?.lockDecks ?? false,
            useEventGameOptions: event?.useEventGameOptions ?? false,
            spectators: event?.spectators ?? false,
            muteSpectators: event?.muteSpectators ?? false,
            showHand: event?.showHand ?? false,
            useGameTimeLimit: event?.useGameTimeLimit ?? false,
            gameTimeLimit: event?.gameTimeLimit ?? null,
            useChessClocks: event?.useChessClocks ?? false,
            chessClockTimeLimit: event?.chessClockTimeLimit ?? null,
            chessClockDelay: event?.chessClockDelay ?? null,
            password: event?.password ?? '',
            restrictTableCreators: !!event?.validTableCreators,
            validTableCreators: event?.validTableCreators ?? [],
            restrictSpectators: !!event?.validSpectators,
            validSpectators: event?.validSpectators ?? []
        };
    }, [event, allRestrictedLists]);

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

    if (isLoading || isRestrictedListsLoading) {
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
                    {(formProps) => (
                        <EventEditorForm
                            isNew={!eventId}
                            formProps={formProps}
                            allRestrictedLists={allRestrictedLists}
                            isSaveLoading={isSaveLoading}
                            dispatch={dispatch}
                        />
                    )}
                </Formik>
            </Panel>
        </Page>
    );
};

export default EventEditor;
