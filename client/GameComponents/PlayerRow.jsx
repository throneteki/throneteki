import React from 'react';
import _ from 'underscore';
import $ from 'jquery';

import Card from './Card.jsx';
import CardCollection from './CardCollection.jsx';
import {tryParseJSON} from '../util.js';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onDrawClick = this.onDrawClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onShowDeckClick = this.onShowDeckClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onCloseAndShuffleClick = this.onCloseAndShuffleClick.bind(this);
        this.onAgendaClick = this.onAgendaClick.bind(this);
        this.onDragDrop = this.onDragDrop.bind(this);

        this.state = {
            showDrawMenu: false
        };
    }

    onDragOver(event) {
        $(event.target).addClass('highlight-panel');
        event.preventDefault();
    }

    onDragLeave(event) {
        $(event.target).removeClass('highlight-panel');
    }

    onDragDrop(event, target) {
        event.stopPropagation();
        event.preventDefault();

        $(event.target).removeClass('highlight-panel');

        var card = event.dataTransfer.getData('Text');

        if(!card) {
            return;
        }

        var dragData = tryParseJSON(card);
        if(!dragData) {
            return;
        }

        if(this.props.onDragDrop) {
            this.props.onDragDrop(dragData.card, dragData.source, target);
        }
    }

    onCloseClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    onCloseAndShuffleClick(event) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }

        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onDiscardedCardClick(event, cardId) {
        event.preventDefault();
        event.stopPropagation();

        if(this.props.onDiscardedCardClick) {
            this.props.onDiscardedCardClick(cardId);
        }
    }

    getHand(needsSquish) {
        var cardIndex = 0;
        var handLength = this.props.hand ? this.props.hand.length : 0;
        var requiredWidth = handLength * 64;
        var overflow = requiredWidth - 342;
        var offset = overflow / (handLength - 1);

        var hand = _.map(this.props.hand, card => {
            var left = (64 - offset) * cardIndex++;

            var style = {};
            if(needsSquish) {
                style = {
                    left: left + 'px'
                };
            }

            return (<Card key={card.uuid} card={card} style={style} disableMouseOver={!this.props.isMe} source='hand'
                         onMouseOver={this.props.onMouseOver}
                         onMouseOut={this.props.onMouseOut}
                         onMenuItemClick={this.props.onMenuItemClick}
                         onClick={this.props.onCardClick} />);
        });

        return hand;
    }

    getDrawDeck() {
        var drawDeckPopup = undefined;

        if(this.props.showDrawDeck && this.props.drawDeck) {
            var drawDeck = _.map(this.props.drawDeck, card => {
                return (<Card key={card.uuid} card={card} source='draw deck'
                             onMouseOver={this.props.onMouseOver}
                             onMouseOut={this.props.onMouseOut}
                             onClick={this.props.onCardClick} />);
            });

            drawDeckPopup = (
                <div className='popup panel' onClick={event => event.stopPropagation() }>
                    <div>
                        <a onClick={this.onCloseClick}>Close</a>
                        <a onClick={this.onCloseAndShuffleClick}>Close and shuffle</a>
                    </div>
                    <div className='inner'>
                        {drawDeck}
                    </div>
                </div>);
        }

        return drawDeckPopup;
    }

    onDrawClick(event) {
        event.preventDefault();

        this.setState({ showDrawMenu: !this.state.showDrawMenu });
    }

    onAgendaClick(event) {
        event.preventDefault();

        this.setState({ showAgendaMenu: !this.state.showAgendaMenu });
    }

    onShuffleClick(event) {
        event.preventDefault();

        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onShowDeckClick(event) {
        event.preventDefault();

        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    render() {
        var className = 'panel hand';
        var needsSquish = this.props.hand && this.props.hand.length * 64 > 342;

        if(needsSquish) {
            className += ' squish';
        }

        var hand = this.getHand(needsSquish);
        var drawDeckPopup = this.getDrawDeck();

        var drawDeckMenu = this.state.showDrawMenu ?
            (<div className='panel menu'>
                <div onClick={this.onShowDeckClick}>Show</div>
                <div onClick={this.onShuffleClick}>Shuffle</div>
            </div>)
            : null;

        return (
            <div className='player-home-row'>
                <div className={className} onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={(event) => this.onDragDrop(event, 'hand')}>
                    <div className='panel-header'>
                        {'Hand (' + hand.length + ')'}
                    </div>
                    {hand}
                </div>
                <CardCollection className='discard' title='Discard' source='discard pile' cards={this.props.discardPile}
                                onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} />

                <div className='draw card-pile vertical panel' onDragLeave={this.onDragLeave} onDragOver={this.onDragOver} onDrop={(event) => this.onDragDrop(event, 'draw deck')}
                    onClick={this.props.isMe ? this.onDrawClick : null}>
                    <div className='panel-header'>
                        {'Draw (' + this.props.numDrawCards + ')'}
                    </div>
                    <div className='card vertical ignore-mouse-events'>
                        <img className='card-image vertical' src='/img/cards/cardback.jpg' />
                    </div>
                    {drawDeckMenu}
                    {drawDeckPopup}
                </div>
                <CardCollection className='faction' source='faction' cards={[]} topCard={this.props.faction} onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} disablePopup />
                {this.props.agenda && this.props.agenda.code !== '' ?
                    <CardCollection className='agenda' source='agenda' cards={[]} topCard={this.props.agenda} onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut}
                          onClick={this.onClick} disablePopup onMenuItemClick={this.props.onMenuItemClick} />
                    : <div className='agenda card-pile vertical panel' />
                }
                <CardCollection className='dead' title='Dead' source='dead pile' cards={this.props.deadPile}
                                onMouseOver={this.props.onMouseOver} onMouseOut={this.props.onMouseOut} onCardClick={this.props.onCardClick}
                                popupLocation={this.props.isMe || this.props.spectating ? 'top' : 'bottom'} onDragDrop={this.props.onDragDrop} orientation='kneeled' />
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    agenda: React.PropTypes.object,
    deadPile: React.PropTypes.array,
    discardPile: React.PropTypes.array,
    drawDeck: React.PropTypes.array,
    faction: React.PropTypes.object,
    hand: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    numDrawCards: React.PropTypes.number,
    onCardClick: React.PropTypes.func,
    onDiscardedCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onDrawClick: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onShuffleClick: React.PropTypes.func,
    plotDeck: React.PropTypes.array,
    power: React.PropTypes.number,
    showDrawDeck: React.PropTypes.bool,
    spectating: React.PropTypes.bool
};

export default PlayerRow;
