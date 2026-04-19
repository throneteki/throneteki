import React from 'react';
import { forwardRef, useCallback, useMemo, useState } from 'react';
import { Formik, getIn, useFormikContext } from 'formik';
import { Button, Input, Switch } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import GameOptions from './GameOptions';
import GameTypes from './GameTypes';
import Panel from '../Site/Panel';
import { sendNewGameMessage } from '../../redux/reducers/lobby';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import { GameFormats } from '../../constants';
import FormatSelect from './FormatSelect';
import VariantSelect from './VariantSelect';
import LegalitySelect from './LegalitySelect';
import EventSelect from './EventSelect';

const GameNameMaxLength = 64;

const NewGame = forwardRef(function NewGame(
    { quickJoin = false, defaultGameType, defaultPrivate, defaultTimeLimit, onClosed },
    ref
) {
    const dispatch = useDispatch();
    const connected = useSelector((state) => state.lobby.connected);
    const user = useSelector((state) => state.auth.user);

    const schema = yup.object({
        name: yup
            .string()
            .required('You must specify a name for the game')
            .max(GameNameMaxLength, `Game name must be less than ${GameNameMaxLength} characters`),
        gameFormat: yup.string().required(),
        gameVariant: yup.string().required(),
        gameLegality: yup.string().required(),
        gameType: yup.string().required(),
        gamePrivate: yup.boolean(),
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
        maxPlayers: yup.number().when('gameFormat', {
            is: 'melee',
            then: (s) =>
                s
                    .required('You must specify a number of players')
                    .min(2, 'Melee must have at least 2 players')
                    .max(8, 'Melee cannot have more than 8 players')
        }),
        randomSeats: yup.boolean().when('gameFormat', {
            is: 'melee',
            then: (s) => s.required()
        }),
        allowMultipleWinners: yup.boolean().when('gameFormat', {
            is: 'melee',
            then: (s) => s.required()
        })
    });

    const initialValues = {
        name: `${user?.username}'s game`,
        password: '',
        eventId: null,
        allowSpectators: true,
        gameFormat: 'joust',
        gameType: defaultGameType || 'casual',
        useGameTimeLimit: !!defaultTimeLimit,
        gameTimeLimit: defaultTimeLimit || 55,
        gamePrivate: defaultPrivate,
        useChessBlocks: false,
        chessClockTimeLimit: 30,
        chessClockDelay: 5,
        maxPlayers: 4,
        randomSeats: true,
        allowMultipleWinners: false
    };

    if (!connected) {
        return (
            <AlertPanel variant={AlertType.Danger}>
                The connection to the lobby has been lost, waiting for it to be restored. If this
                message persists, please refresh the page.
            </AlertPanel>
        );
    }
    return (
        <Panel title={quickJoin ? 'Quick Join' : 'New game'} ref={ref}>
            <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                    dispatch(sendNewGameMessage(values));
                }}
                initialValues={initialValues}
            >
                <NewGameForm quickJoin={quickJoin} onClosed={onClosed} />
            </Formik>
        </Panel>
    );
});

const NewGameForm = ({ quickJoin, onClosed = () => true }) => {
    const {
        values,
        errors,
        touched,
        isSubmitting,
        handleChange,
        getFieldProps,
        setFieldValue,
        handleSubmit
    } = useFormikContext();
    const [isEventGameOptions, setIsEventGameOptions] = useState(false);
    const [userCachedOptions, setUserCachedOptions] = useState();

    const handleFormatChange = useCallback(
        (newFormat) => {
            setFieldValue('gameFormat', newFormat);
        },
        [setFieldValue]
    );

    const handleVariantChange = useCallback(
        (newVariant) => {
            setFieldValue('gameVariant', newVariant);
        },
        [setFieldValue]
    );

    const handleLegalityChange = useCallback(
        (newLegalityId) => {
            setFieldValue('gameLegality', newLegalityId);
        },
        [setFieldValue]
    );

    const handleEventChange = useCallback(
        (newEvent) => {
            const isUsingEventGameOptions = newEvent?.useEventGameOptions ?? false;
            setIsEventGameOptions(isUsingEventGameOptions);
            if (newEvent) {
                if (!userCachedOptions) {
                    setUserCachedOptions({ ...values });
                }
                const gameOptions = {
                    ...userCachedOptions,
                    eventId: newEvent._id,
                    gameFormat: newEvent.format,
                    gameVariant: newEvent.variant,
                    gameLegality:
                        typeof newEvent.legality === 'object' ? 'custom' : newEvent.legality,
                    gameType: newEvent.gameType,
                    ...(newEvent.useEventGameOptions ? newEvent.eventGameOptions : {})
                };

                // Override with event options
                for (const [key, value] of Object.entries(gameOptions)) {
                    setFieldValue(key, value);
                }
            } else if (userCachedOptions) {
                for (const [key, value] of Object.entries({
                    eventId: undefined,
                    ...userCachedOptions
                })) {
                    setFieldValue(key, value);
                }
                setUserCachedOptions(undefined);
            }
        },
        [setFieldValue, userCachedOptions, values]
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

    const canStart = useMemo(
        () => values.gameFormat && values.gameVariant && values.gameLegality,
        [values.gameFormat, values.gameLegality, values.gameVariant]
    );

    return (
        <form
            onSubmit={async (event) => {
                event.preventDefault();

                handleSubmit(event);
            }}
        >
            <div className='flex flex-col gap-2'>
                {quickJoin && (
                    <AlertPanel variant={AlertType.Info}>
                        Select the type of game you&apos;d like to play and either you&apos;ll join
                        the next one available, or one will be created for you with default options.
                    </AlertPanel>
                )}
                {!quickJoin && (
                    <>
                        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2'>
                            <Input
                                label='Name'
                                endContent={<span>{GameNameMaxLength - values.name.length}</span>}
                                type='text'
                                placeholder='Game Name'
                                maxLength={GameNameMaxLength}
                                {...getFieldProps('name')}
                                {...getValidationProps('name')}
                            />
                            <Input
                                autoComplete='off'
                                label='Password'
                                type='password'
                                placeholder={'Enter a password'}
                                {...getFieldProps('password')}
                                isDisabled={isEventGameOptions}
                            />
                            <EventSelect
                                label='Event'
                                placeholder='None'
                                selected={values.eventId}
                                onSelected={handleEventChange}
                                {...getValidationProps('eventId')}
                            />
                            <FormatSelect
                                label='Format'
                                selected={values.gameFormat}
                                onSelected={handleFormatChange}
                                {...getValidationProps('gameFormat')}
                                disallowEmptySelection
                                isDisabled={!!values.eventId}
                            />
                            <VariantSelect
                                label='Variant'
                                format={values.gameFormat}
                                selected={values.gameVariant}
                                onSelected={handleVariantChange}
                                {...getValidationProps('gameVariant')}
                                disallowEmptySelection
                                isDisabled={!!values.eventId}
                            />
                            <LegalitySelect
                                label='Legality'
                                format={values.gameFormat}
                                variant={values.gameVariant}
                                selected={values.gameLegality}
                                onSelected={handleLegalityChange}
                                {...getValidationProps('gameLegality')}
                                disallowEmptySelection
                                isDisabled={!!values.eventId}
                                allowCustom={!!values.eventId}
                            />
                        </div>
                        {GameFormats.find((f) => f.name === values.gameFormat)?.experimental && (
                            <AlertPanel
                                variant='warning'
                                message={`The ${values.gameFormat} format is experimental and may not work as expected. Please report any issues to the developers on Github.`}
                            />
                        )}
                        <GameOptions isDisabled={isEventGameOptions} />
                        {values.gameFormat === 'melee' && (
                            <div>
                                <div className='font-bold'>Melee Options</div>
                                <div className='flex gap-2'>
                                    <Input
                                        label={'Max. players'}
                                        className='max-w-32'
                                        type='number'
                                        {...getFieldProps('maxPlayers')}
                                        {...getValidationProps('maxPlayers')}
                                        isDisabled={isEventGameOptions}
                                    />
                                    <Switch
                                        classNames={{ label: 'text-sm' }}
                                        name={'randomSeats'}
                                        onChange={handleChange}
                                        isSelected={values.randomSeats}
                                        isDisabled={isEventGameOptions}
                                    >
                                        Random Seats
                                    </Switch>
                                    <Switch
                                        classNames={{ label: 'text-sm' }}
                                        name={'allowMultipleWinners'}
                                        onChange={handleChange}
                                        isSelected={values.allowMultipleWinners}
                                        isDisabled={isEventGameOptions}
                                    >
                                        Allow Multiple Winners
                                    </Switch>
                                </div>
                            </div>
                        )}
                    </>
                )}
                <GameTypes isDisabled={!!values.eventId} />
                <div className='flex gap-2'>
                    <Button
                        color='success'
                        type='submit'
                        isDisabled={!canStart}
                        isLoading={isSubmitting}
                    >
                        Start
                    </Button>
                    <Button color='primary' onPress={() => onClosed()}>
                        Cancel
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default NewGame;
