import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Panel from '../Site/Panel';
import AlertPanel from '../Site/AlertPanel';
import { cardSetLabel } from '../Decks/DeckHelper';
import { cancelNewGame, sendNewGameMessage } from '../../redux/reducers/lobby';
import { useGetEventsQuery, useGetRestrictedListQuery } from '../../redux/middleware/api';

const GameNameMaxLength = 64;

const NewGame = ({ defaultGameName, quickJoin }) => {
    const [selectedMode, setSelectedMode] = useState('none:none');
    const [eventId, setEventId] = useState('none');
    const [restrictedListId, setRestrictedListId] = useState('none');
    const [optionsLocked, setOptionsLocked] = useState(false);
    const [spectators, setSpectators] = useState(true);
    const [showHand, setShowHand] = useState(false);
    const [selectedGameFormat, setSelectedGameFormat] = useState('joust');
    const [selectedGameType, setSelectedGameType] = useState('casual');
    const [password, setPassword] = useState('');
    const [gamePrivate, setGamePrivate] = useState(false);
    const [useGameTimeLimit, setUseGameTimeLimit] = useState(false);
    const [gameTimeLimit, setGameTimeLimit] = useState(55);
    const [muteSpectators, setMuteSpectators] = useState(false);
    const [useChessClocks, setUseChessClocks] = useState(false);
    const [chessClockTimeLimit, setChessClockTimeLimit] = useState(30);
    const [delayToStartClock, setDelayToStartClock] = useState(5);
    const [tableType, setTableType] = useState('game');
    const [gameName, setGameName] = useState(defaultGameName);
    const [error, setError] = useState();

    const dispatch = useDispatch();
    const user = useSelector((state) => state.auth.user);
    const allowMelee = useSelector((state) =>
        state.auth.user ? state.auth.user.permissions.allowMelee : false
    );
    const isLobbyConnected = useSelector((state) => state.lobby.connected);

    const { data: events, isLoading: isEventsLoading, error: eventsError } = useGetEventsQuery();

    const {
        data: restrictedLists,
        isLoading: isRestrictedListLoading,
        error: restrictedListError
    } = useGetRestrictedListQuery();

    const onCancelClick = useCallback(
        (event) => {
            event.preventDefault();

            dispatch(cancelNewGame());
        },
        [dispatch]
    );

    const onEventChange = useCallback(
        (event) => {
            const selectedValues = event.target.value.split(':');
            const eventId = selectedValues[0] || 'none';
            const restrictedListId = selectedValues[1] || '';

            setEventId(eventId);
            setRestrictedListId(restrictedListId);
            setSelectedMode(event.target.value);
            setTableType('game');

            const selectedEvent = events.find((e) => e._id === event.target.value);
            setOptionsLocked(false);
            if (selectedEvent && selectedEvent.useEventGameOptions) {
                setOptionsLocked(true);
                if (selectedEvent.eventGameOptions.spectators !== undefined) {
                    setSpectators(selectedEvent.eventGameOptions.spectators);
                }
                if (selectedEvent.eventGameOptions.muteSpectators !== undefined) {
                    setMuteSpectators(selectedEvent.eventGameOptions.muteSpectators);
                }
                if (selectedEvent.eventGameOptions.showHand !== undefined) {
                    setShowHand(selectedEvent.eventGameOptions.showHand);
                }
                if (selectedEvent.eventGameOptions.useGameTimeLimit !== undefined) {
                    setUseGameTimeLimit(selectedEvent.eventGameOptions.useGameTimeLimit);
                }
                if (selectedEvent.eventGameOptions.gameTimeLimit !== undefined) {
                    setGameTimeLimit(selectedEvent.eventGameOptions.gameTimeLimit);
                }
                if (selectedEvent.eventGameOptions.useChessClocks !== undefined) {
                    setUseChessClocks(selectedEvent.eventGameOptions.useChessClocks);
                }
                if (selectedEvent.eventGameOptions.chessClockTimeLimit !== undefined) {
                    setChessClockTimeLimit(selectedEvent.eventGameOptions.chessClockTimeLimit);
                }
                if (selectedEvent.eventGameOptions.delayToStartClock !== undefined) {
                    setDelayToStartClock(selectedEvent.eventGameOptions.delayToStartClock);
                }
                if (selectedEvent.eventGameOptions.password !== undefined) {
                    setPassword(selectedEvent.eventGameOptions.password);
                }
                setSelectedGameType('competitive');
            }
        },
        [events]
    );

    const onUseChessClocksClick = useCallback((event) => {
        setUseChessClocks(event.target.checked);
        if (event.target.checked) {
            setUseGameTimeLimit(false);
        }
    }, []);

    const onSubmitClick = useCallback(
        (event) => {
            event.preventDefault();

            dispatch(
                sendNewGameMessage({
                    name: gameName,
                    eventId: eventId,
                    restrictedListId: restrictedListId,
                    spectators: spectators,
                    showHand: showHand,
                    gameType: selectedGameType,
                    isMelee: selectedGameFormat === 'melee',
                    password: password,
                    gamePrivate: gamePrivate,
                    quickJoin: quickJoin,
                    useGameTimeLimit: useGameTimeLimit,
                    gameTimeLimit: gameTimeLimit,
                    muteSpectators: muteSpectators,
                    useChessClocks: useChessClocks,
                    chessClockTimeLimit: chessClockTimeLimit,
                    delayToStartClock: delayToStartClock,
                    tableType: tableType
                })
            );
        },
        [
            chessClockTimeLimit,
            delayToStartClock,
            dispatch,
            eventId,
            gameName,
            gamePrivate,
            gameTimeLimit,
            muteSpectators,
            password,
            quickJoin,
            restrictedListId,
            selectedGameFormat,
            selectedGameType,
            showHand,
            spectators,
            tableType,
            useChessClocks,
            useGameTimeLimit
        ]
    );

    const onRadioChange = useCallback(({ key, value }) => {
        switch (key) {
            case 'selectedGameType':
                setSelectedGameType(value);
                break;
            case 'tableType':
                setTableType(value);
                break;
        }
    }, []);

    const onUseGameTimeLimitClick = useCallback((event) => {
        setUseGameTimeLimit(event.target.checked);
        if (event.target.checked) {
            setUseChessClocks(false);
        }
    }, []);

    const options = useMemo(() => {
        if (tableType !== 'game') {
            return undefined;
        }

        return (
            <div className='row'>
                <div className='checkbox col-sm-8'>
                    <label>
                        <input
                            type='checkbox'
                            onChange={(event) => setSpectators(event.target.checked)}
                            checked={spectators}
                            disabled={optionsLocked}
                        />
                        Allow spectators
                    </label>
                </div>
                {spectators && (
                    <div className='checkbox col-sm-8'>
                        <label>
                            <input
                                type='checkbox'
                                onChange={(event) => setMuteSpectators(event.target.checked)}
                                checked={muteSpectators}
                                disabled={optionsLocked}
                            />
                            Mute spectators
                        </label>
                    </div>
                )}
                <div className='checkbox col-sm-8'>
                    <label>
                        <input
                            type='checkbox'
                            onChange={(event) => setShowHand(event.target.checked)}
                            checked={showHand}
                            disabled={optionsLocked}
                        />
                        Show hands to spectators
                    </label>
                </div>
                <div className='checkbox col-sm-12'>
                    <label>
                        <input
                            type='checkbox'
                            onChange={onUseGameTimeLimitClick}
                            checked={useGameTimeLimit}
                            disabled={optionsLocked}
                        />
                        Use a time limit (in minutes)
                    </label>
                </div>
                {useGameTimeLimit && (
                    <div className='col-sm-4'>
                        <input
                            className='form-control'
                            type='number'
                            onChange={(event) => setGameTimeLimit(event.target.value)}
                            value={gameTimeLimit}
                            disabled={optionsLocked}
                        />
                    </div>
                )}
                <div className='checkbox col-sm-12'>
                    <label>
                        <input
                            type='checkbox'
                            onChange={onUseChessClocksClick}
                            checked={useChessClocks}
                            disabled={optionsLocked}
                        />
                        Use chess clocks
                    </label>
                </div>
                {useChessClocks && (
                    <div className='col-sm-6'>
                        <label>Time limit per player (in minutes)</label>
                        <input
                            className='form-control'
                            type='number'
                            onChange={(event) => setChessClockTimeLimit(event.target.value)}
                            value={chessClockTimeLimit}
                            disabled={optionsLocked}
                        />
                        <label>Delay to start the clock (in seconds)</label>#
                        <input
                            className='form-control'
                            type='number'
                            onChange={(event) => setDelayToStartClock(event.target.value)}
                            value={delayToStartClock}
                            disabled={optionsLocked}
                        />
                    </div>
                )}
            </div>
        );
    }, [
        chessClockTimeLimit,
        delayToStartClock,
        gameTimeLimit,
        muteSpectators,
        onUseChessClocksClick,
        onUseGameTimeLimitClick,
        optionsLocked,
        showHand,
        spectators,
        tableType,
        useChessClocks,
        useGameTimeLimit
    ]);

    const meleeOptions = useMemo(() => {
        if (!allowMelee) {
            return undefined;
        }

        return (
            <div className='row'>
                <div className='col-sm-12'>
                    <b>Game Format</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input
                            type='radio'
                            onChange={() => setSelectedGameFormat('joust')}
                            checked={selectedGameFormat === 'joust'}
                        />
                        Joust
                    </label>
                    <label className='radio-inline'>
                        <input
                            type='radio'
                            onChange={() => setSelectedGameFormat('melee')}
                            checked={selectedGameFormat === 'melee'}
                        />
                        Melee
                    </label>
                </div>
            </div>
        );
    }, [allowMelee, selectedGameFormat]);

    const gameTypeOptions = useMemo(() => {
        if (tableType !== 'game') {
            return undefined;
        }

        return (
            <div className='row'>
                <div className='col-sm-12 game-type'>
                    <b>Game Type</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input
                            type='radio'
                            onChange={() =>
                                onRadioChange({
                                    key: 'selectedGameType',
                                    value: 'beginner'
                                })
                            }
                            checked={selectedGameType === 'beginner'}
                            disabled={optionsLocked}
                        />
                        Beginner
                    </label>
                    <label className='radio-inline'>
                        <input
                            type='radio'
                            onChange={() =>
                                onRadioChange({
                                    key: 'selectedGameType',
                                    value: 'casual'
                                })
                            }
                            checked={selectedGameType === 'casual'}
                            disabled={optionsLocked}
                        />
                        Casual
                    </label>
                    <label className='radio-inline'>
                        <input
                            type='radio'
                            onChange={() =>
                                onRadioChange({
                                    key: 'selectedGameType',
                                    value: 'competitive'
                                })
                            }
                            checked={selectedGameType === 'competitive'}
                            disabled={optionsLocked}
                        />
                        Competitive
                    </label>
                </div>
            </div>
        );
    }, [onRadioChange, optionsLocked, selectedGameType, tableType]);

    const eventSelection = useMemo(() => {
        if (!events || !restrictedLists) {
            return undefined;
        }

        const allowedEvents = events.filter(
            (event) =>
                user.permissions.canManageGames ||
                !event.restrictTableCreators ||
                (event.validTableCreators && event.validTableCreators.includes(user.username))
        );

        return (
            <div className='row'>
                <div className='col-sm-8'>
                    <label htmlFor='gameName'>Mode</label>
                    <select className='form-control' value={selectedMode} onChange={onEventChange}>
                        {restrictedLists
                            .filter((rl) => rl.official)
                            .map((rl) => (
                                <option
                                    key={rl._id}
                                    value={`none:${rl._id}`}
                                >{`${cardSetLabel(rl.cardSet)}`}</option>
                            ))}
                        {allowedEvents.map((event, index) => (
                            <option key={index} value={event._id}>
                                Event - {event.name}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }, [
        events,
        onEventChange,
        restrictedLists,
        selectedMode,
        user.permissions.canManageGames,
        user.username
    ]);

    const tableTypeComp = useMemo(() => {
        if (!events) {
            return undefined;
        }

        const selectedEvent = events.find((event) => event._id === eventId);

        if (!selectedEvent || selectedEvent.format !== 'draft') {
            return undefined;
        }

        return (
            <div className='row'>
                <div className='col-sm-12 game-type'>
                    <b>Table Type</b>
                </div>
                <div className='col-sm-10'>
                    <label className='radio-inline'>
                        <input
                            type='radio'
                            onChange={() =>
                                onRadioChange({
                                    key: 'tableType',
                                    value: 'game'
                                })
                            }
                            checked={tableType === 'game'}
                        />
                        Game
                    </label>
                    <label className='radio-inline'>
                        <input
                            type='radio'
                            onChange={() =>
                                onRadioChange({
                                    key: 'tableType',
                                    value: 'drafting-table'
                                })
                            }
                            checked={tableType === 'drafting-table'}
                        />
                        Drafting Table
                    </label>
                </div>
            </div>
        );
    }, [eventId, events, onRadioChange, tableType]);

    useEffect(() => {
        if (restrictedListError) {
            setError(
                restrictedListError.data?.message ||
                    'An error occurred fetching data from the server. Please try again later.'
            );
        } else if (eventsError) {
            setError(
                eventsError.data?.message ||
                    'An error occurred fetching data from the server. Please try again later.'
            );
        }
    }, [eventsError, restrictedListError]);

    const charsLeft = GameNameMaxLength - gameName.length;

    if (!isLobbyConnected) {
        return (
            <AlertPanel
                type='warning'
                message='Your connection to the lobby has been interrupted, if this message persists, refresh your browser'
            />
        );
    }

    if (isEventsLoading || isRestrictedListLoading) {
        return <div>Loading data from server, please wait...</div>;
    }

    return (
        <div>
            <Panel title={quickJoin ? 'Join Existing or Start New Game' : 'New game'}>
                {error && <AlertPanel type='error' message={error} />}
                <form className='form'>
                    <div>
                        <div className='row'>
                            <div className='col-sm-8'>
                                <label htmlFor='gameName'>Name</label>
                                <label className='game-name-char-limit'>
                                    {charsLeft >= 0 ? charsLeft : 0}
                                </label>
                                <input
                                    className='form-control'
                                    placeholder='Game Name'
                                    type='text'
                                    onChange={(event) => setGameName(event.target.value)}
                                    value={gameName}
                                    maxLength={GameNameMaxLength}
                                />
                            </div>
                        </div>
                        {eventSelection}
                        {tableTypeComp}
                        {options}
                        {meleeOptions}
                        {gameTypeOptions}
                        <div className='row'>
                            <div className='checkbox col-sm-8'>
                                <label>
                                    <input
                                        type='checkbox'
                                        onChange={(event) => setGamePrivate(event.target.checked)}
                                        checked={gamePrivate}
                                        disabled={optionsLocked}
                                    />
                                    Private (requires game link)
                                </label>
                            </div>
                        </div>
                        <div className='row game-password'>
                            <div className='col-sm-8'>
                                <label>Password</label>
                                <input
                                    className='form-control'
                                    type='password'
                                    onChange={(event) => setPassword(event.target.value)}
                                    value={password}
                                    disabled={optionsLocked}
                                />
                            </div>
                        </div>
                    </div>
                    <div className='button-row'>
                        <button className='btn btn-primary' onClick={onSubmitClick}>
                            Start
                        </button>
                        <button className='btn btn-primary' onClick={onCancelClick}>
                            Cancel
                        </button>
                    </div>
                </form>
            </Panel>
        </div>
    );
};

export default NewGame;
