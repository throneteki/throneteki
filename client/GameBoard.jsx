import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import ActivePlayerPrompt from './GameComponents/ActivePlayerPrompt.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import PlayerBoard from './GameComponents/PlayerBoard.jsx';
import GameChat from './GameComponents/GameChat.jsx';
import PlayerPlots from './GameComponents/PlayerPlots.jsx';
import GameConfigurationModal from './GameComponents/GameConfigurationModal.jsx';

import * as actions from './actions';

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
        plotDiscard: []
    },
    faction: null,
    firstPlayer: false,
    numDrawCards: 0,
    plotSelected: false,
    stats: null,
    title: null,
    user: null
};

export class InnerGameBoard extends React.Component {
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

        this.state = {
            cardToZoom: undefined,
            showDrawDeck: false,
            spectating: true,
            showActionWindowsMenu: false,
            showCardMenu: {}
        };
    }

    componentDidMount() {
        this.updateContextMenu(this.props);
    }

    componentWillReceiveProps(props) {
        this.updateContextMenu(props);
    }

    updateContextMenu(props) {
        if(!props.currentGame) {
            return;
        }

        let thisPlayer = props.currentGame.players[props.username];

        if(thisPlayer) {
            this.setState({ spectating: false });
        } else {
            this.setState({ spectating: true });
        }

        if(thisPlayer && thisPlayer.selectCard) {
            $('body').addClass('select-cursor');
        } else {
            $('body').removeClass('select-cursor');
        }

        let menuOptions = [
            { text: 'Leave Game', onClick: this.onLeaveClick }
        ];

        if(props.currentGame && props.currentGame.started) {
            if(_.find(props.currentGame.players, p => {
                return p.name === props.username;
            })) {
                menuOptions.unshift({ text: 'Concede', onClick: this.onConcedeClick });
            }

            let spectators = _.map(props.currentGame.spectators, spectator => {
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
        if(!this.props.currentGame) {
            return false;
        }

        if(this.props.currentGame.winner) {
            return false;
        }

        let thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        let otherPlayer = _.find(this.props.currentGame.players, player => {
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
        return (<div className='plots-pane'>
            <PlayerPlots
                { ...commonProps }
                activePlot={ otherPlayer.activePlot }
                agenda={ otherPlayer.agenda }
                direction='reverse'
                isMe={ false }
                plotDeck={ otherPlayer.cardPiles.plotDeck }
                plotDiscard={ otherPlayer.cardPiles.plotDiscard }
                plotSelected={ otherPlayer.plotSelected }
                schemePlots={ otherPlayer.cardPiles.schemePlots } />
            <PlayerPlots
                { ...commonProps }
                activePlot={ thisPlayer.activePlot }
                agenda={ thisPlayer.agenda }
                direction='default'
                isMe
                plotDeck={ thisPlayer.cardPiles.plotDeck }
                plotDiscard={ thisPlayer.cardPiles.plotDiscard }
                plotSelected={ thisPlayer.plotSelected }
                schemePlots={ thisPlayer.cardPiles.schemePlots } />
        </div>);
    }

    onCommand(command, arg, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, method);
    }

    onMenuItemClick(card, menuItem) {
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

    onTimerExpired() {
        this.props.sendGameMessage('menuButton', null, 'pass');
    }

    onSettingsClick() {
        $('#settings-modal').modal('show');
    }

    render() {
        if(!this.props.currentGame) {
            return <div>Waiting for server...</div>;
        }

        let thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        if(!thisPlayer) {
            return <div>Waiting for game to have players or close...</div>;
        }

        let otherPlayer = _.find(this.props.currentGame.players, player => {
            return player.name !== thisPlayer.name;
        }) || placeholderPlayer;

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        return (
            <div className='game-board'>
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
                    { this.getPlots(thisPlayer, otherPlayer) }
                    <div className='board-middle'>
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
                                showHand={ this.props.currentGame.showHand }
                                spectating={ this.state.spectating }
                                title={ otherPlayer.title }
                                cardSize={ this.props.user.settings.cardSize } />
                        </div>
                        <div className='board-inner'>
                            <div className='prompt-area'>
                                <div className='inset-pane'>
                                    <ActivePlayerPrompt title={ thisPlayer.menuTitle }
                                        buttons={ thisPlayer.buttons }
                                        controls={ thisPlayer.controls }
                                        promptTitle={ thisPlayer.promptTitle }
                                        onButtonClick={ this.onCommand }
                                        onMouseOver={ this.onMouseOver }
                                        onMouseOut={ this.onMouseOut }
                                        user={ this.props.user }
                                        onTimerExpired={ this.onTimerExpired.bind(this) }
                                        phase={ thisPlayer.phase } />
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
                                <PlayerBoard
                                    cardsInPlay={ thisPlayer.cardPiles.cardsInPlay }
                                    onCardClick={ this.onCardClick }
                                    onDragDrop={ this.onDragDrop }
                                    onMenuItemClick={ this.onMenuItemClick }
                                    onMouseOut={ this.onMouseOut }
                                    onMouseOver={ this.onMouseOver }
                                    rowDirection='default'
                                    user={ this.props.user } />
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
                                showHand={ this.props.currentGame.showHand }
                                spectating={ this.state.spectating }
                                title={ thisPlayer.title }
                                onMenuItemClick={ this.onMenuItemClick }
                                cardSize={ this.props.user.settings.cardSize } />
                        </div>
                    </div>
                    <div className='right-side'>
                        <CardZoom imageUrl={ this.props.cardToZoom ? '/img/cards/' + this.props.cardToZoom.code + '.png' : '' }
                            orientation={ this.props.cardToZoom ? this.props.cardToZoom.type === 'plot' ? 'horizontal' : 'vertical' : 'vertical' }
                            show={ !!this.props.cardToZoom } cardName={ this.props.cardToZoom ? this.props.cardToZoom.name : null } />
                        <GameChat
                            messages={ this.props.currentGame.messages }
                            onCardMouseOut={ this.onMouseOut }
                            onCardMouseOver={ this.onMouseOver }
                            onSendChat={ this.sendChatMessage } />
                    </div>
                </div>
                <div className='player-stats-row'>
                    <PlayerStats { ...boundActionCreators } stats={ thisPlayer.stats } showControls={ !this.state.spectating } user={ thisPlayer.user }
                        firstPlayer={ thisPlayer.firstPlayer } onSettingsClick={ this.onSettingsClick.bind(this) } />
                </div>
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    cardToZoom: PropTypes.object,
    clearZoom: PropTypes.func,
    closeGameSocket: PropTypes.func,
    currentGame: PropTypes.object,
    dispatch: PropTypes.func,
    sendGameMessage: PropTypes.func,
    setContextMenu: PropTypes.func,
    socket: PropTypes.object,
    user: PropTypes.object,
    username: PropTypes.string,
    zoomCard: PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        currentGame: state.lobby.currentGame,
        socket: state.lobby.socket,
        user: state.auth.user,
        username: state.auth.username
    };
}

function mapDispatchToProps(dispatch) {
    let boundActions = bindActionCreators(actions, dispatch);
    boundActions.dispatch = dispatch;

    return boundActions;
}

const GameBoard = connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })(InnerGameBoard);

export default GameBoard;
