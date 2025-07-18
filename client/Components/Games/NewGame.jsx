import React, { forwardRef, useCallback, useEffect, useMemo, useState } from 'react';
import { Formik } from 'formik';
import { Button, Input, Select, SelectItem, Switch } from '@heroui/react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import GameOptions from './GameOptions';
import GameTypes from './GameTypes';
import { useGetRestrictedListQuery } from '../../redux/middleware/api';
import Panel from '../Site/Panel';
import { sendNewGameMessage } from '../../redux/reducers/lobby';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import { GameFormats } from '../../constants';

const GameNameMaxLength = 64;

const NewGame = forwardRef(function NewGame(
    { quickJoin = false, defaultGameType, defaultPrivate, defaultTimeLimit, onClosed },
    ref
) {
    const dispatch = useDispatch();
    const { data: restrictedLists } = useGetRestrictedListQuery({});

    const connected = useSelector((state) => state.lobby.connected);
    const user = useSelector((state) => state.auth.user);
    const [gameFormat, setGameFormat] = useState('joust');
    const [restrictedList, setRestrictedList] = useState(restrictedLists?.[0]._id);
    const [usingEventOptions, setUsingEventOptions] = useState(false);

    useEffect(() => {
        if (!restrictedList && restrictedLists?.length) {
            setRestrictedList(restrictedLists[0]._id);
        }
    }, [restrictedList, restrictedLists]);

    const restrictedListsById = useMemo(() => {
        return restrictedLists?.reduce((acc, rl) => {
            acc[rl._id] = rl;
            return acc;
        }, {});
    }, [restrictedLists]);

    const syncGameOptions = useCallback(
        (formProps, restirctedListId) => {
            const restrictedList = restrictedListsById[restirctedListId];
            if (restrictedList.useEventGameOptions) {
                formProps.setFieldValue('gameType', 'competitive');
                for (const [key, value] of Object.entries(restrictedList.eventGameOptions)) {
                    formProps.setFieldValue(key, value);
                }
                setUsingEventOptions(true);
            } else {
                setUsingEventOptions(false);
            }
        },
        [restrictedListsById]
    );

    const schema = yup.object({
        name: yup
            .string()
            .required('You must specify a name for the game')
            .max(GameNameMaxLength, `Game name must be less than ${GameNameMaxLength} characters`),
        password: yup.string().optional(),
        gameTimeLimit: yup
            .number()
            .min(10, 'Games must be at least 10 minutes long')
            .max(120, 'Games must be less than 2 hours'),
        chessClockTimeLimit: yup.number().min(1, 'Clock must be at least 1 minute long'),
        chessClockDelay: yup.number().min(0, 'Delay cannot be less than 0').optional(),
        gameFormat: yup.string().required(),
        gameType: yup.string().required(),
        maxPlayers: yup.number().when('gameFormat', {
            is: () => gameFormat === 'melee',
            then: (s) =>
                s
                    .required('You must specify a number of players')
                    .min(2, 'Melee must have at least 2 players')
                    .max(8, 'Melee cannot have more than 8 players')
        })
    });

    const initialValues = {
        name: `${user?.username}'s game`,
        password: '',
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
    const canStart = gameFormat && restrictedList;
    return (
        <Panel title={quickJoin ? 'Quick Join' : 'New game'} ref={ref}>
            <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                    const newGame = Object.assign({}, values, {
                        restrictedList: restrictedListsById[restrictedList],
                        gameFormat
                    });

                    dispatch(sendNewGameMessage(newGame));
                }}
                initialValues={initialValues}
            >
                {(formProps) => (
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();

                            formProps.handleSubmit(event);
                        }}
                    >
                        <div className='flex flex-col gap-2'>
                            {quickJoin && (
                                <AlertPanel variant={AlertType.Info}>
                                    Select the type of game you&apos;d like to play and either
                                    you&apos;ll join the next one available, or one will be created
                                    for you with default options.
                                </AlertPanel>
                            )}
                            {!quickJoin && (
                                <>
                                    <div className='flex flex-col gap-2 w-full lg:grid lg:grid-cols-2'>
                                        <div>
                                            <Input
                                                label='Name'
                                                endContent={
                                                    <span>
                                                        {GameNameMaxLength -
                                                            formProps.values.name.length}
                                                    </span>
                                                }
                                                type='text'
                                                placeholder='Game Name'
                                                maxLength={GameNameMaxLength}
                                                {...formProps.getFieldProps('name')}
                                                isInvalid={
                                                    formProps.errors.name && formProps.touched.name
                                                }
                                                errorMessage={formProps.errors.name}
                                            />
                                        </div>
                                        <div>
                                            <Input
                                                autoComplete='off'
                                                label='Password'
                                                type='password'
                                                placeholder={'Enter a password'}
                                                {...formProps.getFieldProps('password')}
                                            />
                                        </div>
                                        <div>
                                            <Select
                                                label={'Format'}
                                                selectedKeys={new Set([gameFormat])}
                                                onChange={(e) => {
                                                    setGameFormat(e.target.value);
                                                }}
                                                disallowEmptySelection={true}
                                            >
                                                {GameFormats?.map((gm) => (
                                                    <SelectItem key={gm.name} value={gm.name}>
                                                        {`${gm.label}${gm.experimental ? ' (Experimental)' : ''}`}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                        <div>
                                            <Select
                                                label={'Mode'}
                                                selectedKeys={new Set([restrictedList])}
                                                onChange={(e) => {
                                                    setRestrictedList(e.target.value);
                                                    syncGameOptions(formProps, e.target.value);
                                                }}
                                            >
                                                {restrictedLists?.map((rl) => (
                                                    <SelectItem key={rl._id} value={rl._id}>
                                                        {rl.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </div>
                                    {GameFormats.find((f) => f.name === gameFormat)
                                        ?.experimental && (
                                        <AlertPanel
                                            variant='warning'
                                            message={`The ${gameFormat} format is experimental and may not work as expected. Please report any issues to the developers on Github.`}
                                        />
                                    )}
                                    <GameOptions
                                        formProps={formProps}
                                        isDisabled={usingEventOptions}
                                    />
                                    {gameFormat === 'melee' && (
                                        <div>
                                            <div className='font-bold'>Melee Options</div>
                                            <div className='flex gap-2'>
                                                <Input
                                                    label={'Max. players'}
                                                    className='max-w-32'
                                                    type='number'
                                                    {...formProps.getFieldProps('maxPlayers')}
                                                    isInvalid={
                                                        formProps.errors.maxPlayers &&
                                                        formProps.touched.maxPlayers
                                                    }
                                                    errorMessage={formProps.errors.maxPlayers}
                                                    isDisabled={usingEventOptions}
                                                />
                                                <Switch
                                                    classNames={{ label: 'text-sm' }}
                                                    name={'randomSeats'}
                                                    onChange={formProps.handleChange}
                                                    isSelected={formProps.values.randomSeats}
                                                    isDisabled={usingEventOptions}
                                                >
                                                    Random Seats
                                                </Switch>
                                                <Switch
                                                    classNames={{ label: 'text-sm' }}
                                                    name={'allowMultipleWinners'}
                                                    onChange={formProps.handleChange}
                                                    isSelected={
                                                        formProps.values.allowMultipleWinners
                                                    }
                                                    isDisabled={usingEventOptions}
                                                >
                                                    Allow Multiple Winners
                                                </Switch>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                            {<GameTypes formProps={formProps} isDisabled={usingEventOptions} />}
                            <div className='flex gap-2'>
                                <Button color='success' type='submit' isDisabled={!canStart}>
                                    Start
                                </Button>
                                <Button color='primary' onPress={() => onClosed && onClosed()}>
                                    Cancel
                                </Button>
                            </div>
                        </div>
                    </form>
                )}
            </Formik>
        </Panel>
    );
});

export default NewGame;
