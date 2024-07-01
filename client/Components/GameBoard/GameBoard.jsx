import React, { useCallback, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import classNames from 'classnames';

import PlayerStats from './PlayerStats';
import CardZoom from './CardZoom';
import GameChat from './GameChat';
import RookerySetup from './RookerySetup';
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
    const [showMessages, setShowMessages] = useState(false);
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

export class GameBoardOld extends React.Component {
    constructor() {
        super();

        this.state = {
            cardToZoom: undefined,
            spectating: true,
            showActionWindowsMenu: false,
            showCardMenu: {},
            showMessages: true,
            lastMessageCount: 0,
            lastSpectatorCount: 0,
            newMessages: 0,
            displayWarningInNavBar: false
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
        $('.modal-backdrop').remove();
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);

        let lastMessageCount = this.state.lastMessageCount;
        let currentMessageCount = props.currentGame ? props.currentGame.messages.length : 0;

        if (this.state.showMessages) {
            this.setState({ lastMessageCount: currentMessageCount, newMessages: 0 });
        } else {
            this.setState({ newMessages: currentMessageCount - lastMessageCount });
        }
    }

    updateContextMenu(props) {
        if (!props.currentGame || !props.user) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.user.username];

        if (thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        let menuOptions = [{ text: 'Leave Game', onClick: this.onLeaveClick }];

        if (props.currentGame && props.currentGame.started) {
            if (props.currentGame.players[props.user.username]) {
                menuOptions.unshift({ text: 'Concede', onClick: this.onConcedeClick });
            }

            let spectators = props.currentGame.spectators.map((spectator) => {
                return <li key={spectator.id}>{spectator.name}</li>;
            });

            let spectatorPopup = <ul className='spectators-popup absolute-panel'>{spectators}</ul>;

            //if the current user is a player and the number of spectators changed, then display a warning next to the Spectators popup in the navbar
            if (
                props.currentGame.players[props.user.username] &&
                props.currentGame.spectators.length !== this.state.lastSpectatorCount
            ) {
                this.setState({ displayWarningInNavBar: true });
            }

            menuOptions.unshift({
                text: 'Spectators: ' + props.currentGame.spectators.length,
                popup: spectatorPopup,
                displayWarning: this.state.displayWarningInNavBar,
                onMouseOver: this.resetSpectatorWarning.bind(this)
            });

            this.setState({ lastSpectatorCount: props.currentGame.spectators.length });

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    resetSpectatorWarning() {
        this.setState({ displayWarningInNavBar: false });
    }

    setContextMenu(menu) {
        if (this.props.setContextMenu) {
            this.props.setContextMenu(menu);
        }
    }

    onConcedeClick() {
        this.props.sendGameMessage('concede');
    }

    isGameActive() {
        if (!this.props.currentGame || !this.props.user) {
            return false;
        }

        if (this.props.currentGame.winner) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if (!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find((player) => {
            return player.name !== thisPlayer.name;
        });

        if (!otherPlayer) {
            return false;
        }

        if (otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    }

    onLeaveClick() {
        if (!this.state.spectating && this.isGameActive()) {
            toastr.confirm('Your game is not finished, are you sure you want to leave?', {
                onOk: () => {
                    this.props.sendGameMessage('leavegame');
                    this.props.closeGameSocket();
                }
            });

            return;
        }

        this.props.sendGameMessage('leavegame');
        this.props.closeGameSocket();
    }

    renderBoard(thisPlayer, otherPlayer) {
        if (this.props.rookeryDeck) {
            return (
                <RookerySetup
                    cards={this.props.cards}
                    cardSize={this.props.user.settings.cardSize}
                    deck={this.props.rookeryDeck}
                    onCardMouseOut={this.onMouseOut}
                    onCardMouseOver={this.onMouseOver}
                    onSubmit={this.props.submitRookeryPrompt}
                    packs={this.props.packs}
                    players={Object.values(this.props.currentGame.players)}
                    promptId={this.props.rookeryPromptId}
                    restrictedList={this.props.restrictedList}
                />
            );
        }
    }
}

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        cards: state.cards.cards,
        currentGame: state.lobby.currentGame,
        packs: state.cards.packs,
        restrictedList: state.cards.restrictedList,
        rookeryDeck: state.prompt.rookeryDeck,
        rookeryPromptId: state.prompt.rookeryPromptId,
        socket: state.lobby.socket,
        timerLimit: state.prompt.timerLimit,
        timerStartTime: state.prompt.timerStartTime,
        user: state.account.user
    };
}
