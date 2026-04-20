import React from 'react';
import { forwardRef } from 'react';
import { Formik } from 'formik';
import { useDispatch, useSelector } from 'react-redux';
import * as yup from 'yup';
import Panel from '../Site/Panel';
import { sendNewGameMessage } from '../../redux/reducers/lobby';
import AlertPanel, { AlertType } from '../Site/AlertPanel';
import NewGameForm from './NewGameForm';

export const GameNameMaxLength = 64;

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

export default NewGame;
