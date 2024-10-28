import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import classNames from 'classnames';

import PlayerStats from './PlayerStats';
import CardZoom from './CardZoom';
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
    const dispatch = useDispatch();
    const currentGame = useSelector((state) => state.lobby.currentGame);
    const user = useSelector((state) => state.auth.user);
    const { data: cards, isLoading } = useGetCardsQuery();

    const [cardToZoom, setCardToZoom] = useState(undefined);
    const [showMessages, setShowMessages] = useState(true);
    const [newMessages, setNewMessages] = useState(0);
    const [showModal, setShowModal] = useState(false);
    const [lastMessageCount, setLastMessageCount] = useState(0);

    const onMessagesClick = useCallback(() => {
        setShowMessages(!showMessages);

        if (!showMessages) {
            setNewMessages(0);
            setLastMessageCount(currentGame?.messages.length);
        }
    }, [currentGame?.messages.length, showMessages]);

    useEffect(() => {
        let currentMessageCount = currentGame ? currentGame.messages.length : 0;

        if (showMessages) {
            setLastMessageCount(currentMessageCount);
            setNewMessages(0);
        } else {
            setNewMessages(currentMessageCount - lastMessageCount);
        }
    }, [currentGame, lastMessageCount, showMessages]);

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

    if (!currentGame || !cards || !currentGame.started) {
        return <div>Waiting for server...</div>;
    }

    if (!user) {
        dispatch(navigate('/'));
        return <div>You are not logged in, redirecting...</div>;
    }

    if (!thisPlayer) {
        return <div>Waiting for game to have players or close...</div>;
    }

    const boardClass = classNames(
        'absolute top-0 bottom-0 right-0 left-0 flex justify-between flex-col',
        {
            'select-cursor': thisPlayer && thisPlayer.selectCard
        }
    );

    return (
        <div className={boardClass}>
            {showModal && (
                <GameConfigurationModal
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
            )}
            <div>
                <PlayerStats
                    showControls={false}
                    stats={otherPlayer.stats}
                    user={otherPlayer.user}
                    firstPlayer={otherPlayer.firstPlayer}
                />
            </div>
            <div className='flex flex-shrink flex-grow basis-0 overflow-hidden'>
                <GameBoardLayout
                    thisPlayer={thisPlayer}
                    otherPlayer={otherPlayer}
                    onCardClick={onCardClick}
                    onMouseOver={setCardToZoom}
                    onMouseOut={() => setCardToZoom(undefined)}
                />
                {cardToZoom && (
                    <CardZoom
                        imageUrl={'/img/cards/' + cardToZoom.code + '.png'}
                        orientation={
                            cardToZoom
                                ? cardToZoom.type === 'plot'
                                    ? 'horizontal'
                                    : 'vertical'
                                : 'vertical'
                        }
                        show={!!cardToZoom}
                        cardName={cardToZoom ? cardToZoom.name : null}
                        card={cardToZoom ? cards[cardToZoom.code] : null}
                    />
                )}
                {showMessages && (
                    <div className='relative flex flex-col items-end overflow-hidden min-w-72 max-w-72'>
                        <div className='relative w-full flex-1 flex flex-col overflow-y-hidden'>
                            <GameChat
                                messages={currentGame.messages}
                                onCardMouseOut={() => setCardToZoom(undefined)}
                                onCardMouseOver={setCardToZoom}
                                onSendChat={(message) => dispatch(sendGameChatMessage(message))}
                                muted={!thisPlayer && currentGame.muteSpectators}
                            />
                        </div>
                    </div>
                )}
            </div>
            <div>
                <PlayerStats
                    stats={thisPlayer.stats}
                    showControls={!!thisPlayer}
                    showMessages
                    user={thisPlayer.user}
                    firstPlayer={thisPlayer.firstPlayer}
                    onSettingsClick={() => setShowModal(!showModal)}
                    onMessagesClick={onMessagesClick}
                    numMessages={newMessages}
                    muteSpectators={currentGame.muteSpectators}
                    onMuteClick={() => dispatch(sendToggleMuteSpectatorsMessage())}
                />
            </div>
        </div>
    );
};

export default GameBoard;
