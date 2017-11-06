import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { findDOMNode } from 'react-dom';
import _ from 'underscore';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import ActivePlayerPrompt from './GameComponents/ActivePlayerPrompt.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import Messages from './GameComponents/Messages.jsx';
import CardPile from './GameComponents/CardPile.jsx';
import GameConfiguration from './GameComponents/GameConfiguration.jsx';
import PlayerBoard from './GameComponents/PlayerBoard.jsx';

import * as actions from './actions';

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
        this.onKeyPress = this.onKeyPress.bind(this);
        this.onSendClick = this.onSendClick.bind(this);
        this.onChange = this.onChange.bind(this);
        this.onScroll = this.onScroll.bind(this);
        this.onMenuItemClick = this.onMenuItemClick.bind(this);

        this.state = {
            canScroll: true,
            cardToZoom: undefined,
            showDrawDeck: false,
            spectating: true,
            message: '',
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

    componentDidUpdate() {
        if(this.state.canScroll) {
            $(this.refs.messagePanel).scrollTop(999999);
        }
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

    onScroll() {
        let messages = this.refs.messagePanel;

        setTimeout(() => {
            if(messages.scrollTop >= messages.scrollHeight - messages.offsetHeight - 20) {
                this.setState({ canScroll: true });
            } else {
                this.setState({ canScroll: false });
            }
        }, 500);
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

    sendMessage() {
        if(this.state.message === '') {
            return;
        }

        this.props.sendGameMessage('chat', this.state.message);

        this.setState({ message: '' });
    }

    onChange(event) {
        this.setState({ message: event.target.value });
    }

    onKeyPress(event) {
        if(event.key === 'Enter') {
            this.sendMessage();

            event.preventDefault();
        }
    }

    onSendClick(event) {
        event.preventDefault();

        this.sendMessage();
    }

    onShuffleClick() {
        this.props.sendGameMessage('shuffleDeck');
    }

    onDragDrop(card, source, target) {
        this.props.sendGameMessage('drop', card.uuid, source, target);
    }

    getSchemePile(player, isMe) {
        if(!player || !player.agenda || player.agenda.code !== '05045') {
            return;
        }

        return (
            <CardPile
                cards={ player.cardPiles.schemePlots }
                className='plot'
                disablePopup={ !isMe }
                onCardClick={ this.onCardClick }
                onDragDrop={ this.onDragDrop }
                onMenuItemClick={ this.onMenuItemClick }
                onMouseOut={ this.onMouseOut }
                onMouseOver={ this.onMouseOver }
                orientation='horizontal'
                popupLocation={ isMe || this.state.spectating ? 'top' : 'bottom' }
                source='scheme plots'
                spectating={ this.state.spectating }
                title='Schemes'
                topCard={ { facedown: true, kneeled: true } }
                size={ this.props.user.settings.cardSize } />
        );
    }

    getPlots(thisPlayer, otherPlayer) {
        return (<div className='plots-pane'>
            <div className='plot-group'>
                { this.getSchemePile(otherPlayer, false) }
                <CardPile className={ otherPlayer && otherPlayer.plotSelected ? 'plot plot-selected' : 'plot' }
                    title='Plots' source='plot deck' cards={ otherPlayer ? otherPlayer.cardPiles.plotDeck : [] }
                    topCard={ { facedown: true, kneeled: true } } orientation='horizontal'
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disableMouseOver disablePopup
                    onCardClick={ this.onCardClick } orientation='horizontal' size={ this.props.user.settings.cardSize } />
                <CardPile className='plot' title='Used Plots' source='revealed plots' cards={ otherPlayer ? otherPlayer.cardPiles.plotDiscard : [] }
                    topCard={ otherPlayer ? otherPlayer.activePlot : undefined } orientation='horizontal' onMouseOver={ this.onMouseOver }
                    onMouseOut={ this.onMouseOut } onCardClick={ this.onCardClick } size={ this.props.user.settings.cardSize } />
            </div>
            <div className='plot-group our-side'>
                <CardPile className='plot' title='Used Plots' source='revealed plots' cards={ thisPlayer.cardPiles.plotDiscard } topCard={ thisPlayer.activePlot }
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } orientation='horizontal' onMenuItemClick={ this.onMenuItemClick }
                    onCardClick={ this.onCardClick } onDragDrop={ this.onDragDrop } size={ this.props.user.settings.cardSize } />
                <CardPile className={ thisPlayer.plotSelected ? 'plot plot-selected' : 'plot' }
                    title='Plots' source='plot deck' cards={ thisPlayer.cardPiles.plotDeck } topCard={ { facedown: true, kneeled: true } } orientation='horizontal'
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onCardClick={ this.onCardClick } onDragDrop={ this.onDragDrop }
                    closeOnClick size={ this.props.user.settings.cardSize } />
                { this.getSchemePile(thisPlayer, !this.state.spectating) }
            </div>
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
        $(findDOMNode(this.refs.modal)).modal('show');
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
        });

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        let popup = (
            <div id='settings-modal' ref='modal' className='modal fade' tabIndex='-1' role='dialog'>
                <div className='modal-dialog' role='document'>
                    <div className='modal-content settings-popup row'>
                        <div className='modal-header'>
                            <button type='button' className='close' data-dismiss='modal' aria-label='Close'><span aria-hidden='true'>×</span></button>
                            <h4 className='modal-title'>Game Configuration</h4>
                        </div>
                        <div className='modal-body col-xs-12'>
                            <GameConfiguration actionWindows={ thisPlayer.promptedActionWindows } timerSettings={ thisPlayer.timerSettings }
                                keywordSettings={ thisPlayer.keywordSettings } onKeywordSettingToggle={ this.onKeywordSettingToggle.bind(this) }
                                onToggle={ this.onPromptedActionWindowToggle.bind(this) } onTimerSettingToggle={ this.onTimerSettingToggle.bind(this) }
                            />
                        </div>
                    </div>
                </div>
            </div>);

        return (
            <div className='game-board'>
                { popup }
                <div className='player-stats-row'>
                    <PlayerStats stats={ otherPlayer ? otherPlayer.stats : null }
                        user={ otherPlayer ? otherPlayer.user : null } firstPlayer={ otherPlayer && otherPlayer.firstPlayer } />
                </div>
                <div className='main-window'>
                    { this.getPlots(thisPlayer, otherPlayer) }
                    <div className='board-middle'>
                        <div className='player-home-row'>
                            <PlayerRow
                                agenda={ otherPlayer ? otherPlayer.agenda : null }
                                bannerCards={ otherPlayer ? otherPlayer.cardPiles.bannerCards : [] }
                                conclavePile={ otherPlayer ? otherPlayer.cardPiles.conclavePile : [] }
                                faction={ otherPlayer ? otherPlayer.faction : null }
                                hand={ otherPlayer ? otherPlayer.cardPiles.hand : [] } isMe={ false }
                                isMelee={ this.props.currentGame.isMelee }
                                numDrawCards={ otherPlayer ? otherPlayer.numDrawCards : 0 }
                                discardPile={ otherPlayer ? otherPlayer.cardPiles.discardPile : [] }
                                deadPile={ otherPlayer ? otherPlayer.cardPiles.deadPile : [] }
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                outOfGamePile={ otherPlayer ? otherPlayer.cardPiles.outOfGamePile : [] }
                                title={ otherPlayer ? otherPlayer.title : null }
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
                                    cardsInPlay={ otherPlayer ? otherPlayer.cardPiles.cardsInPlay : [] }
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
                        <div className='chat'>
                            <div className='messages panel' ref='messagePanel' onScroll={ this.onScroll }>
                                <Messages messages={ this.props.currentGame.messages } onCardMouseOver={ this.onMouseOver } onCardMouseOut={ this.onMouseOut } />
                            </div>
                            <form>
                                <input className='form-control' placeholder='Chat...' onKeyPress={ this.onKeyPress } onChange={ this.onChange }
                                    value={ this.state.message } />
                            </form>
                        </div>
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
        currentGame: state.games.currentGame,
        socket: state.socket.socket,
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
