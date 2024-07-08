import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
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

const placeholderPlayer = {
    activePlot: null,
    agenda: null,
    cardPiles: {
        bannerCards: [],
        cardsInPlay: [],
        conclavePile: [],
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
    const [lastMessageCount, setLastMessageCount] = useState(0);

    const onMessagesClick = useCallback(() => {
        setShowMessages(!showMessages);

        if (!showMessages) {
            setNewMessages(0);
            setLastMessageCount(currentGame?.messages.length);
        }
    }, [currentGame?.messages.length, showMessages]);

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

    let boardClass = classNames('game-board', {
        'select-cursor': thisPlayer && thisPlayer.selectCard
    });

    return (
        <div className={boardClass}>
            <GameConfigurationModal
                id='settings-modal'
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
            <div className='player-stats-row'>
                <PlayerStats
                    stats={otherPlayer.stats}
                    user={otherPlayer.user}
                    firstPlayer={otherPlayer.firstPlayer}
                />
            </div>
            <div className='main-window'>
                <GameBoardLayout
                    thisPlayer={thisPlayer}
                    otherPlayer={otherPlayer}
                    onCardClick={onCardClick}
                    onMouseOver={setCardToZoom}
                    onMouseOut={() => setCardToZoom(undefined)}
                />
                <CardZoom
                    imageUrl={cardToZoom ? '/img/cards/' + cardToZoom.code + '.png' : ''}
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
                {showMessages && (
                    <div className='right-side'>
                        <div className='gamechat'>
                            <GameChat
                                key='gamechat'
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
            <div className='player-stats-row'>
                <PlayerStats
                    stats={thisPlayer.stats}
                    showControls={!!thisPlayer}
                    user={thisPlayer.user}
                    firstPlayer={thisPlayer.firstPlayer}
                    onSettingsClick={() => $('#settings-modal').modal('show')}
                    showMessages
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
