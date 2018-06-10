import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';
import classNames from 'classnames';

import PlayerStats from './PlayerStats';
import PlayerRow from './PlayerRow';
import ActivePlayerPrompt from './ActivePlayerPrompt';
import CardZoom from './CardZoom';
import PlayerBoard from './PlayerBoard';
import GameChat from './GameChat';
import PlayerPlots from './PlayerPlots';
import RookerySetup from './RookerySetup';
import GameConfigurationModal from './GameConfigurationModal';
import Droppable from './Droppable';
import * as actions from '../../actions';

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
    plotSelected: false,
    stats: null,
    title: null,
    user: null
};

export class GameBoard extends React.Component {
    constructor() {
        super();

        this.onMouseOut = this.onMouseOut.bind(this);
        this.onMouseOver = this.onMouseOver.bind(this);
        this.onCardClick = this.onCardClick.bind(this);
        this.onDrawClick = this.onDrawClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);
        this.onCommand = this.onCommand.bind(this);
        this.onConcedeClick = this.onConcedeClick.bind(this);
        this.onLeaveClick = this.onLeaveClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);
        this.sendChatMessage = this.sendChatMessage.bind(this);
        this.onSettingsClick = this.onSettingsClick.bind(this);
        this.onMessagesClick = this.onMessagesClick.bind(this);

        this.state = {
            cardToZoom: undefined,
            showDrawDeck: false,
            spectating: true,
            showActionWindowsMenu: false,
            showCardMenu: {},
            showMessages: true,
            lastMessageCount: 0,
            newMessages: 0
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);

        let lastMessageCount = this.state.lastMessageCount;
        let currentMessageCount = props.currentGame ? props.currentGame.messages.length : 0;

        if(this.state.showMessages) {
            this.setState({ lastMessageCount: currentMessageCount, newMessages: 0 });
        } else {
            this.setState({ newMessages: currentMessageCount - lastMessageCount });
        }
    }

    updateContextMenu(props) {
        if(!props.currentGame || !props.user) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.user.username];

        if(thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        let menuOptions = [
            { text: 'Leave Game', onClick: this.onLeaveClick }
        ];

        if(props.currentGame && props.currentGame.started) {
            if(props.currentGame.players[props.user.username]) {
                menuOptions.unshift({ text: 'Concede', onClick: this.onConcedeClick });
            }

            let spectators = props.currentGame.spectators.map(spectator => {
                return <li key={ spectator.id }>{ spectator.name }</li>;
            });

            let spectatorPopup = (
                <ul className='spectators-popup absolute-panel'>
                    { spectators }
                </ul>
            );

            menuOptions.unshift({ text: 'Spectators: ' + props.currentGame.spectators.length, popup: spectatorPopup });

            this.setContextMenu(menuOptions);
        } else {
            this.setContextMenu([]);
        }
    }

    setContextMenu(menu) {
        if(this.props.setContextMenu) {
            this.props.setContextMenu(menu);
        }
    }

    onConcedeClick() {
        this.props.sendGameMessage('concede');
    }

    isGameActive() {
        if(!this.props.currentGame || !this.props.user) {
            return false;
        }

        if(this.props.currentGame.winner) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if(!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find(player => {
            return player.name !== thisPlayer.name;
        });

        if(!otherPlayer) {
            return false;
        }

        if(otherPlayer.disconnected || otherPlayer.left) {
            return false;
        }

        return true;
    }

    onLeaveClick() {
        if(!this.state.spectating && this.isGameActive()) {
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

    onMouseOver(card) {
        this.props.zoomCard(card);
    }

    onMouseOut() {
        this.props.clearZoom();
    }

    onCardClick(card) {
        this.props.stopAbilityTimer();
        this.props.sendGameMessage('cardClicked', card.uuid);
    }

    onDrawClick() {
        this.props.sendGameMessage('showDrawDeck');

        this.setState({ showDrawDeck: !this.state.showDrawDeck });
    }

    sendChatMessage(message) {
        this.props.sendGameMessage('chat', message);
    }

    onShuffleClick() {
        this.props.sendGameMessage('shuffleDeck');
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

    getPlots(thisPlayer, otherPlayer) {
        let commonProps = {
            cardSize: this.props.user.settings.cardSize,
            onCardClick: this.onCardClick,
            onCardMouseOut: this.onMouseOut,
            onCardMouseOver: this.onMouseOver,
            onDragDrop: this.onDragDrop,
            onMenuItemClick: this.onMenuItemClick
        };
        return (<div key='plots-pane' className='plots-pane'>
            <PlayerPlots
                { ...commonProps }
                activePlot={ otherPlayer.activePlot }
                agenda={ otherPlayer.agenda }
                direction='reverse'
                isMe={ false }
                plotDeck={ otherPlayer.cardPiles.plotDeck }
                plotDiscard={ otherPlayer.cardPiles.plotDiscard }
                plotSelected={ otherPlayer.plotSelected } />
            <PlayerPlots
                { ...commonProps }
                activePlot={ thisPlayer.activePlot }
                agenda={ thisPlayer.agenda }
                direction='default'
                isMe
                plotDeck={ thisPlayer.cardPiles.plotDeck }
                plotDiscard={ thisPlayer.cardPiles.plotDiscard }
                plotSelected={ thisPlayer.plotSelected } />
        </div>);
    }

    onCommand(command, arg, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, method);
    }

    onMenuItemClick(card, menuItem) {
        this.props.stopAbilityTimer();
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onPromptedActionWindowToggle(option, value) {
        this.props.sendGameMessage('togglePromptedActionWindow', option, value);
    }

    onTimerSettingToggle(option, value) {
        this.props.sendGameMessage('toggleTimerSetting', option, value);
    }

    onKeywordSettingToggle(option, value) {
        this.props.sendGameMessage('toggleKeywordSetting', option, value);
    }

    onSettingsClick() {
        $('#settings-modal').modal('show');
    }

    onMessagesClick() {
        const showState = !this.state.showMessages;

        let newState = {
            showMessages: showState
        };

        if(showState) {
            newState.newMessages = 0;
            newState.lastMessageCount = this.props.currentGame.messages.length;
        }

        this.setState(newState);
    }

    defaultPlayerInfo(source) {
        let player = Object.assign({}, placeholderPlayer, source);
        player.cardPiles = Object.assign({}, placeholderPlayer.cardPiles, player.cardPiles);
        return player;
    }

    renderBoard(thisPlayer, otherPlayer) {
        if(this.props.rookeryDeck) {
            return (
                <RookerySetup
                    cards={ this.props.cards }
                    cardSize={ this.props.user.settings.cardSize }
                    deck={ this.props.rookeryDeck }
                    onCardMouseOut={ this.onMouseOut }
                    onCardMouseOver={ this.onMouseOver }
                    onSubmit={ this.props.submitRookeryPrompt }
                    packs={ this.props.packs }
                    players={ Object.values(this.props.currentGame.players) }
                    restrictedList={ this.props.restrictedList } />);
        }

        return [
            this.getPlots(thisPlayer, otherPlayer),
            <div key='board-middle' className='board-middle'>
                <div className='player-home-row'>
                    <PlayerRow
                        agenda={ otherPlayer.agenda }
                        bannerCards={ otherPlayer.cardPiles.bannerCards }
                        conclavePile={ otherPlayer.cardPiles.conclavePile }
                        faction={ otherPlayer.faction }
                        hand={ otherPlayer.cardPiles.hand } isMe={ false }
                        isMelee={ this.props.currentGame.isMelee }
                        numDrawCards={ otherPlayer.numDrawCards }
                        discardPile={ otherPlayer.cardPiles.discardPile }
                        deadPile={ otherPlayer.cardPiles.deadPile }
                        onCardClick={ this.onCardClick }
                        onMouseOver={ this.onMouseOver }
                        onMouseOut={ this.onMouseOut }
                        outOfGamePile={ otherPlayer.cardPiles.outOfGamePile }
                        username={ this.props.user.username }
                        shadows={ otherPlayer.cardPiles.shadows }
                        showHand={ this.props.currentGame.showHand }
                        spectating={ this.state.spectating }
                        title={ otherPlayer.title }
                        side='top'
                        cardSize={ this.props.user.settings.cardSize } />
                </div>
                <div className='board-inner'>
                    <div className='prompt-area'>
                        <div className='inset-pane'>
                            <ActivePlayerPrompt title={ thisPlayer.menuTitle }
                                cards={ this.props.cards }
                                buttons={ thisPlayer.buttons }
                                controls={ thisPlayer.controls }
                                promptTitle={ thisPlayer.promptTitle }
                                onButtonClick={ this.onCommand }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                user={ this.props.user }
                                phase={ thisPlayer.phase }
                                timerLimit={ this.props.timerLimit }
                                timerStartTime={ this.props.timerStartTime }
                                stopAbilityTimer={ this.props.stopAbilityTimer } />
                        </div>
                    </div>
                    <div className='play-area'>
                        <PlayerBoard
                            cardsInPlay={ otherPlayer.cardPiles.cardsInPlay }
                            onCardClick={ this.onCardClick }
                            onMenuItemClick={ this.onMenuItemClick }
                            onMouseOut={ this.onMouseOut }
                            onMouseOver={ this.onMouseOver }
                            rowDirection='reverse'
                            user={ this.props.user } />
                        <Droppable onDragDrop={ this.onDragDrop } source='play area'>
                            <PlayerBoard
                                cardsInPlay={ thisPlayer.cardPiles.cardsInPlay }
                                onCardClick={ this.onCardClick }
                                onMenuItemClick={ this.onMenuItemClick }
                                onMouseOut={ this.onMouseOut }
                                onMouseOver={ this.onMouseOver }
                                rowDirection='default'
                                user={ this.props.user } />
                        </Droppable>
                    </div>
                </div>
                <div className='player-home-row our-side'>
                    <PlayerRow isMe={ !this.state.spectating }
                        agenda={ thisPlayer.agenda }
                        bannerCards={ thisPlayer.cardPiles.bannerCards }
                        conclavePile={ thisPlayer.cardPiles.conclavePile }
                        faction={ thisPlayer.faction }
                        hand={ thisPlayer.cardPiles.hand }
                        isMelee={ this.props.currentGame.isMelee }
                        onCardClick={ this.onCardClick }
                        onMouseOver={ this.onMouseOver }
                        onMouseOut={ this.onMouseOut }
                        numDrawCards={ thisPlayer.numDrawCards }
                        onDrawClick={ this.onDrawClick }
                        onShuffleClick={ this.onShuffleClick }
                        outOfGamePile={ thisPlayer.cardPiles.outOfGamePile }
                        showDrawDeck={ this.state.showDrawDeck }
                        drawDeck={ thisPlayer.cardPiles.drawDeck }
                        onDragDrop={ this.onDragDrop }
                        discardPile={ thisPlayer.cardPiles.discardPile }
                        deadPile={ thisPlayer.cardPiles.deadPile }
                        shadows={ thisPlayer.cardPiles.shadows }
                        showHand={ this.props.currentGame.showHand }
                        spectating={ this.state.spectating }
                        title={ thisPlayer.title }
                        onMenuItemClick={ this.onMenuItemClick }
                        cardSize={ this.props.user.settings.cardSize }
                        side='bottom' />
                </div>
            </div>
        ];
    }

    render() {
        if(!this.props.currentGame || !this.props.cards) {
            return <div>Waiting for server...</div>;
        }

        if(!this.props.user) {
            this.props.navigate('/');
            return <div>You are not logged in, redirecting...</div>;
        }

        let thisPlayer = this.props.currentGame.players[this.props.user.username];
        if(!thisPlayer) {
            thisPlayer = Object.values(this.props.currentGame.players)[0];
        }

        if(!thisPlayer) {
            return <div>Waiting for game to have players or close...</div>;
        }

        let otherPlayer = Object.values(this.props.currentGame.players).find(player => {
            return player.name !== thisPlayer.name;
        });

        // Default any missing information
        thisPlayer = this.defaultPlayerInfo(thisPlayer);
        otherPlayer = this.defaultPlayerInfo(otherPlayer);

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        let boardClass = classNames('game-board', {
            'select-cursor': thisPlayer && thisPlayer.selectCard
        });

        return (
            <div className={ boardClass }>
                <GameConfigurationModal
                    id='settings-modal'
                    keywordSettings={ thisPlayer.keywordSettings }
                    onKeywordSettingToggle={ this.onKeywordSettingToggle.bind(this) }
                    onPromptedActionWindowToggle={ this.onPromptedActionWindowToggle.bind(this) }
                    onTimerSettingToggle={ this.onTimerSettingToggle.bind(this) }
                    promptedActionWindows={ thisPlayer.promptedActionWindows }
                    timerSettings={ thisPlayer.timerSettings } />
                <div className='player-stats-row'>
                    <PlayerStats stats={ otherPlayer.stats }
                        user={ otherPlayer.user } firstPlayer={ otherPlayer.firstPlayer } />
                </div>
                <div className='main-window'>
                    { this.renderBoard(thisPlayer, otherPlayer) }
                    <CardZoom imageUrl={ this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.code + '.png' : '' }
                        orientation={ this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical' }
                        show={ !!this.props.cardToZoom } cardName={ this.props.cardToZoom ? this.props.cardToZoom.name : null }
                        card={ this.props.cardToZoom ? this.props.cards[this.props.cardToZoom.code] : null } />
                    { this.state.showMessages && <div className='right-side'>
                        <div className='gamechat'>
                            <GameChat key='gamechat'
                                messages={ this.props.currentGame.messages }
                                onCardMouseOut={ this.onMouseOut }
                                onCardMouseOver={ this.onMouseOver }
                                onSendChat={ this.sendChatMessage } />
                        </div>
                    </div>
                    }
                </div>
                <div className='player-stats-row'>
                    <PlayerStats { ...boundActionCreators } stats={ thisPlayer.stats } showControls={ !this.state.spectating } user={ thisPlayer.user }
                        firstPlayer={ thisPlayer.firstPlayer } onSettingsClick={ this.onSettingsClick } showMessages
                        onMessagesClick={ this.onMessagesClick } numMessages={ this.state.newMessages } />
                </div>
            </div >);
    }
}

GameBoard.displayName = 'GameBoard';
GameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    cards: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    navigate: PropTypes.func,
    packs: PropTypes.array,
    restrictedList: PropTypes.array,
    rookeryDeck: PropTypes.object,
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
    stopAbilityTimer: PropTypes.func,
    submitRookeryPrompt: PropTypes.func,
    timerLimit: PropTypes.number,
    timerStartTime: PropTypes.instanceOf(Date),
    user: PropTypes.object,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        cards: state.cards.cards,
        currentGame: state.lobby.currentGame,
        packs: state.cards.packs,
        restrictedList: state.cards.restrictedList,
        rookeryDeck: state.prompt.rookeryDeck,
        socket: state.lobby.socket,
        timerLimit: state.prompt.timerLimit,
        timerStartTime: state.prompt.timerStartTime,
        user: state.account.user
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

export default connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(GameBoard);

