import React from 'react';
import { Formik } from 'formik';
import { Button, Input, Select, SelectItem } from '@nextui-org/react';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';

import GameOptions from './GameOptions';
import GameTypes from './GameTypes';
import { useGetRestrictedListQuery } from '../../redux/middleware/api';
import Panel from '../Site/Panel';
import { sendNewGameMessage } from '../../redux/reducers/lobby';
import AlertPanel, { AlertType } from '../Site/AlertPanel';

const GameNameMaxLength = 64;

const NewGame = ({
    quickJoin = false,
    defaultGameType,
    defaultPrivate,
    defaultTimeLimit,
    onClosed
}) => {
    const dispatch = useDispatch();
    const { data: restrictedLists } = useGetRestrictedListQuery({});

    const connected = useSelector((state) => state.lobby.connected);
    const user = useSelector((state) => state.auth.user);

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
        gameFormat: yup.string().required(),
        gameType: yup.string().required()
    });

    const initialValues = {
        name: `${user?.username}'s game`,
        password: '',
        allowSpectators: true,
        gameFormat: 'normal',
        gameType: defaultGameType || 'casual',
        useGameTimeLimit: !!defaultTimeLimit,
        gameTimeLimit: defaultTimeLimit || 55,
        gamePrivate: defaultPrivate,
        useChessBlocks: false,
        gameChessClockLimit: 30,
        dt: true
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
        <Panel title={quickJoin ? 'Quick Join' : 'New game'}>
            <Formik
                validationSchema={schema}
                onSubmit={(values) => {
                    dispatch(sendNewGameMessage(values));
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
                        {quickJoin && (
                            <div className='mb-2'>
                                <AlertPanel variant={AlertType.Info}>
                                    Select the type of game you&apos;d like to play and either
                                    you&apos;ll join the next one available, or one will be created
                                    for you with default options.
                                </AlertPanel>
                            </div>
                        )}
                        {!quickJoin && (
                            <>
                                {
                                    <>
                                        <div className='mb-2 w-1/2'>
                                            <Input
                                                label={'Name'}
                                                endContent={
                                                    <span>
                                                        {GameNameMaxLength -
                                                            formProps.values.name.length}
                                                    </span>
                                                }
                                                type='text'
                                                placeholder={'Game Name'}
                                                maxLength={GameNameMaxLength}
                                                {...formProps.getFieldProps('name')}
                                                errorMessage={formProps.errors.name}
                                            />
                                        </div>
                                        <div className='mb-2 w-1/2'>
                                            <Select
                                                label={'Mode'}
                                                {...formProps.getFieldProps('restrictedListId')}
                                            >
                                                {restrictedLists?.map((rl) => (
                                                    <SelectItem key={rl.name} value={rl.id}>
                                                        {rl.name}
                                                    </SelectItem>
                                                ))}
                                            </Select>
                                        </div>
                                    </>
                                }
                                <GameOptions formProps={formProps} />
                            </>
                        )}
                        {<GameTypes formProps={formProps} />}
                        {!quickJoin && (
                            <div className='mt-4 lg:w-1/2'>
                                <Input
                                    autocomplete='new-password'
                                    label={'Password'}
                                    type='password'
                                    placeholder={'Enter a password'}
                                    {...formProps.getFieldProps('password')}
                                />
                            </div>
                        )}
                        <div className='mt-4'>
                            <Button color='success' type='submit'>
                                Start
                            </Button>
                            <Button
                                color='primary'
                                onClick={() => onClosed && onClosed()}
                                className='ms-1'
                            >
                                Cancel
                            </Button>
                        </div>
                    </form>
                )}
            </Formik>
        </Panel>
    );
};

export default NewGame;
