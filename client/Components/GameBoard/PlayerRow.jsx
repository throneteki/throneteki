import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import CardPile from './CardPile';
import PlayerHand from './PlayerHand';
import Droppable from './Droppable';

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

        let outOfGamePile = (<CardPile
            cards={ pile }
            className='additional-cards'
            onCardClick={ this.props.onCardClick }
            onDragDrop={ this.props.onDragDrop }
            onMenuItemClick={ this.props.onMenuItemClick }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            orientation='kneeled'
            popupLocation={ this.props.side }
            source='out of game'
            title='Out of Game'
            size={ this.props.cardSize } />);

        if(this.props.isMe) {
            return (<Droppable onDragDrop={ this.props.onDragDrop } source='out of game'>
                { outOfGamePile }
            </Droppable>);
        }

        return outOfGamePile;
    }

    getAgenda() {
        if(!this.props.agenda || this.props.agenda.code === '') {
            let className = classNames('agenda', 'card-pile', 'vertical', 'panel', {
                [this.props.cardSize]: this.props.cardSize !== 'normal'
            });
            return <div className={ className } />;
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

        let pileClass = classNames('agenda', `agenda-${this.props.agenda.code}`);

        let pile = (<CardPile className={ pileClass }
            cards={ cards }
            disablePopup={ disablePopup }
            onCardClick={ this.props.onCardClick }
            onDragDrop={ this.props.onDragDrop }
            onMenuItemClick={ this.props.onMenuItemClick }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            popupLocation={ this.props.side }
            source={ source }
            title={ title }
            topCard={ this.props.agenda }
            size={ this.props.cardSize } />);

        if(this.props.agenda.code === '09045') {
            return (
                <Droppable onDragDrop={ this.props.onDragDrop } source='conclave'>
                    { pile }
                </Droppable>
            );
        }

        return pile;
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

    render() {
        var drawDeckMenu = this.props.isMe && !this.props.spectating ? [
            { text: 'Show', handler: this.onShowDeckClick, showPopup: true },
            { text: 'Shuffle', handler: this.onShuffleClick }
        ] : null;

        var drawDeckPopupMenu = [
            { text: 'Close and Shuffle', handler: this.onCloseAndShuffleClick }
        ];

        let hand = (<PlayerHand
            cards={ this.props.hand }
            isMe={ this.props.isMe }
            username={ this.props.username }
            onCardClick={ this.props.onCardClick }
            onMouseOut={ this.props.onMouseOut }
            onMouseOver={ this.props.onMouseOver }
            showHand={ this.props.showHand }
            spectating={ this.props.spectating }
            cardSize={ this.props.cardSize } />);
        let drawDeck = (<CardPile className='draw' title='Draw' source='draw deck' cards={ this.props.drawDeck }
            onDragDrop={ this.props.onDragDrop }
            onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut }
            onCardClick={ this.props.isMe && !this.props.spectating ? this.props.onCardClick : null }
            popupLocation={ this.props.side }
            disablePopup={ this.props.spectating || !this.props.isMe }
            menu={ drawDeckMenu } hiddenTopCard cardCount={ this.props.numDrawCards } popupMenu={ drawDeckPopupMenu }
            onCloseClick={ this.onCloseClick.bind(this) }
            size={ this.props.cardSize } />);
        let discardPile = (<CardPile className='discard' title='Discard' source='discard pile' cards={ this.props.discardPile }
            onDragDrop={ this.props.onDragDrop }
            onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
            popupLocation={ this.props.side }
            size={ this.props.cardSize } />);
        let deadPile = (<CardPile className='dead' title='Dead' source='dead pile' cards={ this.props.deadPile }
            onDragDrop={ this.props.onDragDrop }
            onMouseOver={ this.props.onMouseOver } onMouseOut={ this.props.onMouseOut } onCardClick={ this.props.onCardClick }
            popupLocation={ this.props.side }
            orientation='kneeled' size={ this.props.cardSize } />);

        return (
            <div className='player-home-row-container'>
                <CardPile className='faction' source='faction' cards={ [] } topCard={ this.props.faction }
                    onMouseOver={ this.onMouseOver } onMouseOut={ this.onMouseOut } disablePopup
                    onCardClick={ this.props.onCardClick }
                    size={ this.props.cardSize } />
                { this.getAgenda() }
                { this.getTitleCard() }
                { this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source='hand' >{ hand }</Droppable> : hand }
                { this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source='draw deck'>{ drawDeck }</Droppable> : drawDeck }
                { this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source='discard pile'>{ discardPile }</Droppable> : discardPile }
                { this.props.isMe ? <Droppable onDragDrop={ this.props.onDragDrop } source='dead pile'>{ deadPile }</Droppable> : deadPile }

                { this.getOutOfGamePile() }
            </div>
        );
    }
}

PlayerRow.displayName = 'PlayerRow';
PlayerRow.propTypes = {
    agenda: PropTypes.object,
    bannerCards: PropTypes.array,
    cardSize: PropTypes.string,
    conclavePile: PropTypes.array,
    deadPile: PropTypes.array,
    discardPile: PropTypes.array,
    drawDeck: PropTypes.array,
    faction: PropTypes.object,
    hand: PropTypes.array,
    isMe: PropTypes.bool,
    isMelee: PropTypes.bool,
    numDrawCards: PropTypes.number,
    onCardClick: PropTypes.func,
    onDragDrop: PropTypes.func,
    onDrawClick: PropTypes.func,
    onMenuItemClick: PropTypes.func,
    onMouseOut: PropTypes.func,
    onMouseOver: PropTypes.func,
    onShuffleClick: PropTypes.func,
    outOfGamePile: PropTypes.array,
    plotDeck: PropTypes.array,
    power: PropTypes.number,
    showDrawDeck: PropTypes.bool,
    showHand: PropTypes.bool,
    side: PropTypes.oneOf(['top', 'bottom']),
    spectating: PropTypes.bool,
    title: PropTypes.object,
    username: PropTypes.string
};

export default PlayerRow;
