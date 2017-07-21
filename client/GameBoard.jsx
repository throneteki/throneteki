import React from 'react';
import { connect } from 'react-redux';
import _ from 'underscore';
import $ from 'jquery';
import {toastr} from 'react-redux-toastr';

import PlayerStats from './GameComponents/PlayerStats.jsx';
import PlayerRow from './GameComponents/PlayerRow.jsx';
import MenuPane from './GameComponents/MenuPane.jsx';
import CardZoom from './GameComponents/CardZoom.jsx';
import Messages from './GameComponents/Messages.jsx';
import AdditionalCardPile from './GameComponents/AdditionalCardPile.jsx';
import Card from './GameComponents/Card.jsx';
import CardCollection from './GameComponents/CardCollection.jsx';
import ActionWindowsMenu from './GameComponents/ActionWindowsMenu.jsx';
import {tryParseJSON} from './util.js';

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

        var thisPlayer = props.currentGame.players[props.username];

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

        var menuOptions = [
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
        var messages = this.refs.messagePanel;

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

        var thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        var otherPlayer = _.find(this.props.currentGame.players, player => {
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
        var dragData = { card: card, source: source };
        event.dataTransfer.setData('Text', JSON.stringify(dragData));
    }

    getCardsInPlay(player, isMe) {
        if(!player) {
            return [];
        }

        var sortedCards = _.sortBy(player.cardsInPlay, card => {
            return card.type;
        });

        if(!isMe) {
            // we want locations on the bottom, other side wants locations on top
            sortedCards = sortedCards.reverse();
        }

        var cardsByType = _.groupBy(sortedCards, card => {
            return card.type;
        });

        var cardsByLocation = [];

        _.each(cardsByType, cards => {
            var cardsInPlay = _.map(cards, card => {
                return (<Card key={ card.uuid } source='play area' card={ card } disableMouseOver={ card.facedown && !card.code } onMenuItemClick={ this.onMenuItemClick }
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onClick={ this.onCardClick } onDragDrop={ this.onDragDrop } />);
            });
            cardsByLocation.push(cardsInPlay);
        });

        return cardsByLocation;
    }

    getAgenda(player, isMe, popupLocation) {
        if(!player || !player.agenda || player.agenda.code === '') {
            return <div className='agenda card-pile vertical panel' />;
        }

        let cards = [];
        let disablePopup = false;
        let title;

        // Alliance
        if(player.agenda.code === '06018') {
            cards = player.bannerCards;
        } else if(player.agenda.code === '09045') {
            let pile = player.additionalPiles['conclave'];
            cards = pile.cards;
            title = 'Conclave';
            disablePopup = !isMe;
        }

        disablePopup = disablePopup || !cards || cards.length === 0;

        return (
            <CardCollection className='agenda'
                cards={ cards }
                disablePopup={ disablePopup }
                onCardClick={ this.onCardClick }
                onMenuItemClick={ this.onMenuItemClick }
                onMouseOut={ this.onMouseOut }
                onMouseOver={ this.onMouseOver }
                popupLocation={ popupLocation }
                source='agenda'
                title={ title }
                topCard={ player.agenda } />
        );
    }

    getSchemePile(player, isMe) {
        let schemePile = player && player.additionalPiles['scheme plots'];

        if(!schemePile) {
            return;
        }

        return (
            <AdditionalCardPile
                className='plot'
                isMe={ isMe }
                onMouseOut={ this.onMouseOut }
                onMouseOver={ this.onMouseOver }
                pile={ schemePile }
                spectating={ this.state.spectating }
                title='Schemes' />
        );
    }

    onCommand(command, arg, method) {
        var commandArg = arg;

        this.props.sendGameMessage(command, commandArg, method);
    }

    onDragOver(event) {
        event.preventDefault();
    }

    onDragDropEvent(event, target) {
        event.stopPropagation();
        event.preventDefault();

        var card = event.dataTransfer.getData('Text');
        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);

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

    render() {
        if(!this.props.currentGame) {
            return <div>Waiting for server...</div>;
        }

        var thisPlayer = this.props.currentGame.players[this.props.username];
        if(!thisPlayer) {
            thisPlayer = _.toArray(this.props.currentGame.players)[0];
        }

        if(!thisPlayer) {
            return <div>Waiting for game to have players or close...</div>;
        }

        var otherPlayer = _.find(this.props.currentGame.players, player => {
            return player.name !== thisPlayer.name;
        });

        var thisPlayerCards = [];

        var index = 0;

        var thisCardsInPlay = this.getCardsInPlay(thisPlayer, true);
        _.each(thisCardsInPlay, cards => {
            thisPlayerCards.push(<div className='card-row' key={ 'this-loc' + index++ }>{ cards }</div>);
        });
        var otherPlayerCards = [];

        if(otherPlayer) {
            _.each(this.getCardsInPlay(otherPlayer, false), cards => {
                otherPlayerCards.push(<div className='card-row' key={ 'other-loc' + index++ }>{ cards }</div>);
            });
        }

        for(var i = thisPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={ 'this-empty' + i } />);
        }

        for(i = otherPlayerCards.length; i < 2; i++) {
            thisPlayerCards.push(<div className='card-row' key={ 'other-empty' + i } />);
        }

        return (
            <div className='game-board'>
                <div className='main-window'>
                    <div className='left-side'>
                        <div className='player-info'>
                            <PlayerStats gold={ otherPlayer ? otherPlayer.gold : 0 } claim={ otherPlayer ? otherPlayer.claim : 0 }
                                reserve={ otherPlayer ? otherPlayer.reserve : 0 } power={ otherPlayer ? otherPlayer.totalPower : 0 } user={ otherPlayer ? otherPlayer.user : null } />
                            <div className='deck-info'>
                                <div className='deck-type'>
                                    <CardCollection className='faction' source='faction' cards={ [] } topCard={ otherPlayer ? otherPlayer.faction : undefined } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disablePopup />
                                    { this.getAgenda(otherPlayer, false, 'bottom') }
                                </div>
                                { otherPlayer ? <div className={ 'first-player-indicator ' + (!thisPlayer.firstPlayer ? '' : 'hidden') }>First player</div> : '' }
                            </div>
                        </div>
                        <div className='middle'>
                            <div className='plots-pane'>
                                <div className='plot-group'>
                                    { this.getSchemePile(otherPlayer, false) }
                                    <CardCollection className={ otherPlayer && otherPlayer.plotSelected ? 'plot plot-selected' : 'plot' }
                                        title='Plots' source='plot deck' cards={ otherPlayer ? otherPlayer.plotDeck : [] }
                                        topCard={ { facedown: true, kneeled: true } } orientation='horizontal'
                                        onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disableMouseOver disablePopup
                                        onCardClick={ this.onCardClick } orientation='horizontal' />
                                    <CardCollection className='plot' title='Used Plots' source='revealed plots' cards={ otherPlayer ? otherPlayer.plotDiscard : [] }
                                        topCard={ otherPlayer ? otherPlayer.activePlot : undefined } orientation='horizontal' onMouseOver={ this.onMouseOver }
                                        onMouseOut={ this.onMouseOut } onCardClick={ this.onCardClick } />
                                </div>
                                <div className='plot-group our-side'>
                                    <CardCollection className='plot' title='Used Plots' source='revealed plots' cards={ thisPlayer.plotDiscard } topCard={ thisPlayer.activePlot }
                                        onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } orientation='horizontal' onMenuItemClick={ this.onMenuItemClick }
                                        onCardClick={ this.onCardClick } onDragDrop={ this.onDragDrop } />
                                    <CardCollection className={ thisPlayer.plotSelected ? 'plot plot-selected' : 'plot' }
                                        title='Plots' source='plot deck' cards={ thisPlayer.plotDeck } topCard={ { facedown: true, kneeled: true } } orientation='horizontal'
                                        onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onCardClick={ this.onCardClick } onDragDrop={ this.onDragDrop } />
                                    { this.getSchemePile(thisPlayer, !this.state.spectating) }
                                </div>
                            </div>
                            <div className='middle-right'>
                                <div className='inset-pane'>
                                    { !this.state.spectating && this.state.showActionWindowsMenu ?
                                        <ActionWindowsMenu options={ thisPlayer.promptedActionWindows }
                                            onToggle={ this.onPromptedActionWindowToggle.bind(this) } />
                                        : null }
                                    <div className={ 'phase-indicator ' + thisPlayer.phase } onClick={ this.onMenuTitleClick.bind(this) }>
                                        { <span className={ this.state.spectating ? '' : this.state.showActionWindowsMenu ? 'down-arrow' : 'up-arrow' } /> }
                                        { thisPlayer.phase } phase
                                    </div>
                                    <MenuPane title={ thisPlayer.menuTitle } buttons={ thisPlayer.buttons } promptTitle={ thisPlayer.promptTitle } onButtonClick={ this.onCommand }
                                        onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } onTitleClick={ this.onMenuTitleClick.bind(this) } />
                                </div>
                                <div className='schemes-pane' />
                            </div>
                        </div>
                        <div className='player-info our-side'>
                            <PlayerStats gold={ thisPlayer.gold || 0 } claim={ thisPlayer.claim || 0 } reserve={ thisPlayer.reserve || 0 }
                                power={ thisPlayer.totalPower } isMe={ !this.state.spectating } user={ thisPlayer.user } />
                            <div className='deck-info'>
                                <div className={ 'first-player-indicator ' + (thisPlayer.firstPlayer ? '' : 'hidden') }>First player</div>
                                <div className='deck-type'>
                                    <CardCollection className='faction' source='faction' cards={ [] } topCard={ thisPlayer.faction } onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disablePopup onCardClick={ this.onFactionCardClick } />
                                    { this.getAgenda(thisPlayer, !this.state.spectating, 'top') }
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className='center'>
                        <PlayerRow
                            additionalPiles={ otherPlayer ? otherPlayer.additionalPiles : {} }
                            hand={ otherPlayer ? otherPlayer.hand : [] } isMe={ false }
                            numDrawCards={ otherPlayer ? otherPlayer.numDrawCards : 0 }
                            discardPile={ otherPlayer ? otherPlayer.discardPile : [] }
                            deadPile={ otherPlayer ? otherPlayer.deadPile : [] }
                            onCardClick={ this.onCardClick }
                            onMouseOver={ this.onMouseOver }
                            onMouseOut={ this.onMouseOut }
                        />
                        <div className='play-area'>
                            <div className='player-board'>
                                { otherPlayerCards }
                            </div>
                            <div className='player-board our-side' onDragOver={ this.onDragOver }
                                onDrop={ event => this.onDragDropEvent(event, 'play area') } >
                                { thisPlayerCards }
                            </div>
                        </div>
                        <PlayerRow isMe={ !this.state.spectating }
                            additionalPiles={ thisPlayer.additionalPiles }
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
                            onMenuItemClick={ this.onMenuItemClick }/>
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
            </div>);
    }
}

InnerGameBoard.displayName = 'GameBoard';
InnerGameBoard.propTypes = {
    cardToZoom: React.PropTypes.object,
    clearZoom: React.PropTypes.func,
    closeGameSocket: React.PropTypes.func,
    currentGame: React.PropTypes.object,
    sendGameMessage: React.PropTypes.func,
    setContextMenu: React.PropTypes.func,
    socket: React.PropTypes.object,
    username: React.PropTypes.string,
    zoomCard: React.PropTypes.func
};

function mapStateToProps(state) {
    return {
        cardToZoom: state.cards.zoomCard,
        currentGame: state.games.currentGame,
        socket: state.socket.socket,
        username: state.auth.username
    };
}

const GameBoard = connect(mapStateToProps, actions, null, { withRef: true })(InnerGameBoard);

export default GameBoard;
