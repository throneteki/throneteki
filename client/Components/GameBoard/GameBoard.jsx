import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';
import LoadingSpinner from '../Site/LoadingSpinner';

import PlayerStats from './PlayerStats';
import GameChat from './GameChat';
import GameConfigurationModal from './GameConfigurationModal';
import { useGetCardsQuery } from '../../redux/middleware/api';
import { navigate } from '../../redux/reducers/navigation';
import {
    sendCardClickedMessage,
    sendGameChatMessage,
    sendToggleDupesMessage,
    sendToggleKeywordSettingMessage,
    sendToggleMuteSpectatorsMessage,
    sendTogglePromptedActionWindowMessage,
    sendToggleTimerSetting
} from '../../redux/reducers/game';
import GameBoardLayout from './GameBoardLayout';

import './GameBoard.css';

const placeholderPlayer = {
    activePlot: null,
    agendas: [],
    cardPiles: {
        cardsInPlay: [],
        deadPile: [],
        discardPile: [],
        hand: [],
        outOfGamePile: [],
        plotDeck: [],
        plotDiscard: [],
        shadows: []
    },
    faction: null,
    firstPlayer: false,
    numDrawCards: 0,
    selectedPlot: null,
    stats: null,
    title: null,
    user: null
};

const defaultPlayerInfo = (source) => {
    let player = Object.assign({}, placeholderPlayer, source);
    player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
    return player;
};

const GameBoard = () => {
    // const gameBoardLayoutRef = useRef(null);
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const { data: cards, isLoading: isCardsLoading } = useGetCardsQuery();

    const [showGameChat, setShowGameChat] = useState(window.innerWidth > 768);
    const [unreadMessages, setUnreadMessages] = useState(0);
    const [showModal, setShowModal] = useState(false);

    const onCardClick = useCallback(
        (card) => {
            //stopAbilityTimer();
            dispatch(sendCardClickedMessage(card.uuid));
        },
        [dispatch]
    );

    let thisPlayer = useMemo(() => {
        return defaultPlayerInfo(
            currentGame?.players[user?.username] || Object.values(currentGame.players)[0]
        );
    }, [currentGame?.players, user?.username]);

    let otherPlayer = useMemo(() => {
        return defaultPlayerInfo(
            Object.values(currentGame.players).find((player) => player.name !== thisPlayer.name)
        );
    }, [currentGame?.players, thisPlayer?.name]);

    if (!currentGame || !currentGame.started) {
        return <LoadingSpinner label={'Waiting for server...'} />;
    }

    if (isCardsLoading) {
        return <LoadingSpinner label={'Waiting to fetch cards...'} />;
    }

    if (!user) {
        dispatch(navigate('/'));
        return <LoadingSpinner label={'You are not logged in, redirecting...'} />;
    }

    if (!thisPlayer) {
        return <LoadingSpinner label={'Waiting for game to have players or close...'} />;
    }

    const boardClass = classNames('absolute top-0 bottom-0 right-0 left-0 flex overflow-x-hidden', {
        'select-cursor': thisPlayer && thisPlayer.selectCard
    });

    return (
        <>
            <div className={boardClass}>
                <div className='overflow-auto basis-[100%]'>
                    <div className='flex flex-col min-w-max h-full'>
                        <PlayerStats
                            showControls={false}
                            stats={otherPlayer.stats}
                            user={otherPlayer.user}
                            firstPlayer={otherPlayer.firstPlayer}
                        />
                        <GameBoardLayout
                            thisPlayer={thisPlayer}
                            otherPlayer={otherPlayer}
                            onCardClick={onCardClick}
                        />
                        <PlayerStats
                            stats={thisPlayer.stats}
                            showControls={true}
                            showMessages
                            user={thisPlayer.user}
                            firstPlayer={thisPlayer.firstPlayer}
                            onSettingsClick={() => setShowModal(!showModal)}
                            onMessagesClick={() => setShowGameChat(!showGameChat)}
                            numMessages={unreadMessages}
                            muteSpectators={currentGame.muteSpectators}
                            onMuteClick={() => dispatch(sendToggleMuteSpectatorsMessage())}
                        />
                    </div>
                </div>
                <GameChat
                    className='shrink-0 grow-0'
                    isOpen={showGameChat}
                    onClose={() => setShowGameChat(false)}
                    onUnreadMessagesChange={setUnreadMessages}
                    messages={currentGame.messages}
                    onSendChat={(message) => dispatch(sendGameChatMessage(message))}
                    muted={!thisPlayer && currentGame.muteSpectators}
                />
            </div>
            <GameConfigurationModal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                keywordSettings={thisPlayer.keywordSettings}
                onKeywordSettingToggle={(option, value) =>
                    dispatch(sendToggleKeywordSettingMessage(option, value))
                }
                onPromptDupesToggle={(value) => dispatch(sendToggleDupesMessage(value))}
                onPromptedActionWindowToggle={(option, value) =>
                    dispatch(sendTogglePromptedActionWindowMessage(option, value))
                }
                onTimerSettingToggle={(option, value) =>
                    dispatch(sendToggleTimerSetting(option, value))
                }
                promptDupes={thisPlayer.promptDupes}
                promptedActionWindows={thisPlayer.promptedActionWindows}
                timerSettings={thisPlayer.timerSettings}
            />
        </>
    );
};

export default GameBoard;
