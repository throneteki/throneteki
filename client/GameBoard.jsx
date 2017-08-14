import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import { toastr } from 'react-redux-toastr';
import { bindActionCreators } from 'redux';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import ActivePlayerPrompt from './GameComponents/ActivePlayerPrompt.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import Messages from './GameComponents/Messages.jsx';
import Card from './GameComponents/Card.jsx';
import CardPile from './GameComponents/CardPile.jsx';
import ActionWindowsMenu from './GameComponents/ActionWindowsMenu.jsx';
import { tryParseJSON } from './util.js';

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
        this.onFactionCardClick = this.onFactionCardClick.bind(this);

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

        if(otherPlayer.disconnected) {
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

    onFactionCardClick() {
        this.props.sendGameMessage('factionCardClicked');
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

    onCardDragStart(event, card, source) {
        let dragData = { card: card, source: source };
        event.dataTransfer.setData('Text', JSON.stringify(dragData));
    }

    getCardsInPlay(player, isMe) {
        if(!player) {
            return [];
        }

        let sortedCards = _.sortBy(player.cardsInPlay, card => {
            return card.type;
        });

        if(!isMe) {
            // we want locations on the bottom, other side wants locations on top
            sortedCards = sortedCards.reverse();
        }

        let cardsByType = _.groupBy(sortedCards, card => {
            return card.type;
        });

        let cardsByLocation = [];

        _.each(cardsByType, cards => {
            let cardsInPlay = _.map(cards, card => {
                return (<Card key={ card.uuid } source='play area' card={ card } disableMouseOver={ card.facedown && !card.code } onMenuItemClick={ this.onMenuItemClick }
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onClick={ this.onCardClick } onDragDrop={ this.onDragDrop } />);
            });
            cardsByLocation.push(cardsInPlay);
        });

        return cardsByLocation;
    }

    getSchemePile(player, isMe) {
        let schemePile = player && player.additionalPiles['scheme plots'];

        if(!schemePile) {
            return;
        }

        return (
            <CardPile
                cards={ schemePile.cards }
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
                topCard={ { facedown: true, kneeled: true } } />
        );
    }

    getPlots(thisPlayer, otherPlayer) {
        return (<div className='plots-pane'>
            <div className='plot-group'>
                { this.getSchemePile(otherPlayer, false) }
                <CardPile className={ otherPlayer && otherPlayer.plotSelected ? 'plot plot-selected' : 'plot' }
                    title='Plots' source='plot deck' cards={ otherPlayer ? otherPlayer.plotDeck : [] }
                    topCard={ { facedown: true, kneeled: true } } orientation='horizontal'
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disableMouseOver disablePopup
                    onCardClick={ this.onCardClick } orientation='horizontal' />
                <CardPile className='plot' title='Used Plots' source='revealed plots' cards={ otherPlayer ? otherPlayer.plotDiscard : [] }
                    topCard={ otherPlayer ? otherPlayer.activePlot : undefined } orientation='horizontal' onMouseOver={ this.onMouseOver }
                    onMouseOut={ this.onMouseOut } onCardClick={ this.onCardClick } />
            </div>
            <div className='plot-group our-side'>
                <CardPile className='plot' title='Used Plots' source='revealed plots' cards={ thisPlayer.plotDiscard } topCard={ thisPlayer.activePlot }
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } orientation='horizontal' onMenuItemClick={ this.onMenuItemClick }
                    onCardClick={ this.onCardClick } onDragDrop={ this.onDragDrop } />
                <CardPile className={ thisPlayer.plotSelected ? 'plot plot-selected' : 'plot' }
                    title='Plots' source='plot deck' cards={ thisPlayer.plotDeck } topCard={ { facedown: true, kneeled: true } } orientation='horizontal'
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onCardClick={ this.onCardClick } onDragDrop={ this.onDragDrop }
                    closeOnClick />
                { this.getSchemePile(thisPlayer, !this.state.spectating) }
            </div>
        </div>);
    }

    onCommand(command, arg, method) {
        let commandArg = arg;

        this.props.sendGameMessage(command, commandArg, method);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDragDropEvent(event, target) {
        event.stopPropagation();
        event.preventDefault();

        let card = event.dataTransfer.getData('Text');
        if(!card) {
            return;
        }

        let dragData = tryParseJSON(card);

        if(!dragData) {
            return;
        }

        this.onDragDrop(dragData.card, dragData.source, target);
    }

    onMenuItemClick(card, menuItem) {
        this.props.sendGameMessage('menuItemClick', card.uuid, menuItem);
    }

    onMenuTitleClick() {
        this.setState({ showActionWindowsMenu: !this.state.showActionWindowsMenu });
    }

    onPromptedActionWindowToggle(option, value) {
        this.props.sendGameMessage('togglePromptedActionWindow', option, value);
    }

    onTimerExpired() {
        this.props.sendGameMessage('menuButton', null, 'pass');
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

        let thisPlayerCards = [];
        let index = 0;
        let thisCardsInPlay = this.getCardsInPlay(thisPlayer, true);
        _.each(thisCardsInPlay, cards => {
            thisPlayerCards.push(<div className='card-row' key={ 'this-loc' + index++ }>{ cards }</div>);
        });

        let otherPlayerCards = [];
        if(otherPlayer) {
            _.each(this.getCardsInPlay(otherPlayer, false), cards => {
                otherPlayerCards.push(<div className='card-row' key={ 'other-loc' + index++ }>{ cards }</div>);
            });
        }

        for(let i = thisPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={ 'this-empty' + i } />);
        }

        for(let i = otherPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={ 'other-empty' + i } />);
        }

        let boundActionCreators = bindActionCreators(actions, this.props.dispatch);

        return (
            <div className='game-board'>
                <div className='player-stats-row'>
                    <PlayerStats stats={ otherPlayer ? otherPlayer.stats : null }
                        user={ otherPlayer ? otherPlayer.user : null } firstPlayer={ otherPlayer && otherPlayer.firstPlayer } />
                </div>
                <div className='main-window'>
                    { this.getPlots(thisPlayer, otherPlayer) }
                    <div className='board-middle'>
                        <div className='player-home-row'>
                            <PlayerRow
                                additionalPiles={ otherPlayer ? otherPlayer.additionalPiles : {} }
                                agenda={ otherPlayer ? otherPlayer.agenda : null }
                                bannerCards={ otherPlayer ? otherPlayer.bannerCards : [] }
                                faction={ otherPlayer ? otherPlayer.faction : null }
                                hand={ otherPlayer ? otherPlayer.hand : [] } isMe={ false }
                                numDrawCards={ otherPlayer ? otherPlayer.numDrawCards : 0 }
                                discardPile={ otherPlayer ? otherPlayer.discardPile : [] }
                                deadPile={ otherPlayer ? otherPlayer.deadPile : [] }
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut } />
                        </div>
                        <div className='board-inner'>
                            <div className='prompt-area'>
                                <div className='inset-pane'>
                                    { !this.state.spectating && this.state.showActionWindowsMenu ?
                                        <ActionWindowsMenu options={ thisPlayer.promptedActionWindows }
                                            onToggle={ this.onPromptedActionWindowToggle.bind(this) } />
                                        : null }
                                    <ActivePlayerPrompt title={ thisPlayer.menuTitle }
                                        arrowDirection={ this.state.spectating ? 'none' : this.state.showActionWindowsMenu ? 'down' : 'up' }
                                        buttons={ thisPlayer.buttons }
                                        promptTitle={ thisPlayer.promptTitle }
                                        onButtonClick={ this.onCommand }
                                        onMouseOver={ this.onMouseOver }
                                        onMouseOut={ this.onMouseOut }
                                        onTitleClick={ this.onMenuTitleClick.bind(this) }
                                        user={ this.props.user }
                                        onTimerExpired={ this.onTimerExpired.bind(this) }
                                        phase={ thisPlayer.phase } />
                                </div>
                            </div>
                            <div className='play-area'>
                                <div className='player-board'>
                                    { otherPlayerCards }
                                </div>
                                <div className='player-board our-side' onDragOver={ this.onDragOver }
                                    onDrop={ event => this.onDragDropEvent(event, 'play area') } >
                                    { thisPlayerCards }
                                </div>
                            </div>
                        </div>
                        <div className='player-home-row our-side'>
                            <PlayerRow isMe={ !this.state.spectating }
                                additionalPiles={ thisPlayer.additionalPiles }
                                agenda={ thisPlayer.agenda }
                                bannerCards={ thisPlayer.bannerCards }
                                faction={ thisPlayer.faction }
                                hand={ thisPlayer.hand }
                                onCardClick={ this.onCardClick }
                                onMouseOver={ this.onMouseOver }
                                onMouseOut={ this.onMouseOut }
                                numDrawCards={ thisPlayer.numDrawCards }
                                onDrawClick={ this.onDrawClick }
                                onShuffleClick={ this.onShuffleClick }
                                showDrawDeck={ this.state.showDrawDeck }
                                drawDeck={ thisPlayer.drawDeck }
                                onDragDrop={ this.onDragDrop }
                                discardPile={ thisPlayer.discardPile }
                                deadPile={ thisPlayer.deadPile }
                                spectating={ this.state.spectating }
                                onMenuItemClick={ this.onMenuItemClick } />
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
                        firstPlayer={ thisPlayer.firstPlayer } />
                </div>
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    cardToZoom: React.PropTypes.object,
    clearZoom: React.PropTypes.func,
    closeGameSocket: React.PropTypes.func,
    currentGame: React.PropTypes.object,
    dispatch: React.PropTypes.func,
    sendGameMessage: React.PropTypes.func,
    setContextMenu: React.PropTypes.func,
    socket: React.PropTypes.object,
    user: React.PropTypes.object,
    username: React.PropTypes.string,
    zoomCard: React.PropTypes.func
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
