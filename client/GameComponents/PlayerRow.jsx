import React from 'react';

import CardPile from './CardPile.jsx';
import PlayerHand from './PlayerHand.jsx';

class PlayerRow extends React.Component {
    constructor() {
        super();

        this.onDrawClick = this.onDrawClick.bind(this);
        this.onShuffleClick = this.onShuffleClick.bind(this);
        this.onShowDeckClick = this.onShowDeckClick.bind(this);
        this.onCloseClick = this.onCloseClick.bind(this);
        this.onCloseAndShuffleClick = this.onCloseAndShuffleClick.bind(this);

        this.state = {
            showDrawMenu: false
        };
    }

    onCloseClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    onCloseAndShuffleClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }

        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onDrawClick() {
        this.setState({ showDrawMenu: !this.state.showDrawMenu });
    }

    onShuffleClick() {
        if(this.props.onShuffleClick) {
            this.props.onShuffleClick();
        }
    }

    onShowDeckClick() {
        if(this.props.onDrawClick) {
            this.props.onDrawClick();
        }
    }

    getOutOfGamePile() {
        let pile = this.props.outOfGamePile;

        if(pile.length === 0) {
            return;
        }

        return (
            <CardPile
                cards={ pile }
                className='additional-cards'
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                orientation='kneeled'
                popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' }
                source='out of game'
                title='Out of Game'
                size={ this.props.cardSize } />
        );
    }

    getAgenda() {
        if(!this.props.agenda || this.props.agenda.code === '') {
            return <div className={ `agenda ${this.props.cardSize === 'medium' ? '' : this.props.cardSize} card-pile vertical panel` } />;
        }

        let cards = [];
        let disablePopup = false;
        let title;
        let source = 'agenda';

        // Alliance
        if(this.props.agenda.code === '06018') {
            cards = this.props.bannerCards;
            title = 'Banners';
        } else if(this.props.agenda.code === '09045') {
            cards = this.props.conclavePile;
            source = 'conclave';
            title = 'Conclave';
            disablePopup = !this.props.isMe;
        }

        disablePopup = disablePopup || !cards || cards.length === 0;

        return (
            <CardPile className='agenda'
                cards={ cards }
                disablePopup={ disablePopup }
                onCardClick={ this.props.onCardClick }
                onDragDrop={ this.props.onDragDrop }
                onMenuItemClick={ this.props.onMenuItemClick }
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                popupLocation={ this.props.isMe ? 'top' : 'bottom' }
                source={ source }
                title={ title }
                topCard={ this.props.agenda }
                size={ this.props.cardSize } />
        );
    }

    getTitleCard() {
        if(!this.props.isMelee) {
            return;
        }

        return (
            <CardPile className='title'
                cards={ [] }
                disablePopup
                onMouseOut={ this.props.onMouseOut }
                onMouseOver={ this.props.onMouseOver }
                source='title'
                topCard={ this.props.title }
                size={ this.props.cardSize } />
        );
    }

    onFactionCardClick() {
        if(this.props.onFactionCardClick) {
            this.props.onFactionCardClick();
        }
    }

    render() {
        var drawDeckMenu = this.props.isMe && !this.props.spectating ? [
            { text: 'Show', handler: this.onShowDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onShuffleClick }
        ] : null;

        var drawDeckPopupMenu = [
            { text: 'Close and Shuffle', handler: this.onCloseAndShuffleClick }
        ];

        return (
            <div className='player-home-row-container'>
                <CardPile className='faction' source='faction' cards={ [] } topCard={ this.props.faction }
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disablePopup
                    onCardClick={ this.props.isMe && !this.props.spectating ? this.onFactionCardClick.bind(this) : null }
                    size={ this.props.cardSize } />
                { this.getAgenda() }
                { this.getTitleCard() }
                <PlayerHand
                    cards={ this.props.hand }
                    isMe={ this.props.isMe }
                    onCardClick={ this.props.onCardClick }
                    onDragDrop={ this.props.onDragDrop }
                    onMouseOut={ this.props.onMouseOut }
                    onMouseOver={ this.props.onMouseOver }
                    cardSize={ this.props.cardSize } />
                <CardPile className='draw' title='Draw' source='draw deck' cards={ this.props.drawDeck }
                    onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut }
                    onCardClick={ this.props.isMe && !this.props.spectating ? this.props.onCardClick : null }
                    popupLocation='top' onDragDrop={ this.props.onDragDrop } disablePopup={ this.props.spectating || !this.props.isMe }
                    menu={ drawDeckMenu } hiddenTopCard cardCount={ this.props.numDrawCards } popupMenu={ drawDeckPopupMenu }
                    onCloseClick={ this.onCloseClick.bind(this) }
                    size={ this.props.cardSize } />
                <CardPile className='discard' title='Discard' source='discard pile' cards={ this.props.discardPile }
                    onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
                    popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } onDragDrop={ this.props.onDragDrop }
                    size={ this.props.cardSize } />
                <CardPile className='dead' title='Dead' source='dead pile' cards={ this.props.deadPile }
                    onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
                    popupLocation={ this.props.isMe || this.props.spectating ? 'top' : 'bottom' } onDragDrop={ this.props.onDragDrop }
                    orientation='kneeled' size={ this.props.cardSize } />
                { this.getOutOfGamePile() }
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    agenda: React.PropTypes.object,
    bannerCards: React.PropTypes.array,
    cardSize: React.PropTypes.string,
    conclavePile: React.PropTypes.array,
    deadPile: React.PropTypes.array,
    discardPile: React.PropTypes.array,
    drawDeck: React.PropTypes.array,
    faction: React.PropTypes.object,
    hand: React.PropTypes.array,
    isMe: React.PropTypes.bool,
    isMelee: React.PropTypes.bool,
    numDrawCards: React.PropTypes.number,
    onCardClick: React.PropTypes.func,
    onDragDrop: React.PropTypes.func,
    onDrawClick: React.PropTypes.func,
    onFactionCardClick: React.PropTypes.func,
    onMenuItemClick: React.PropTypes.func,
    onMouseOut: React.PropTypes.func,
    onMouseOver: React.PropTypes.func,
    onShuffleClick: React.PropTypes.func,
    outOfGamePile: React.PropTypes.array,
    plotDeck: React.PropTypes.array,
    power: React.PropTypes.number,
    showDrawDeck: React.PropTypes.bool,
    spectating: React.PropTypes.bool,
    title: React.PropTypes.object
};

export default PlayerRow;
