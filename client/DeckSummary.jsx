import React from 'react';
import _ from 'underscore';

import StatusPopOver from './StatusPopOver.jsx';

class DeckSummary extends React.Component {
    constructor() {
        super();

        this.onCardMouseOut = this.onCardMouseOut.bind(this);
        this.onCardMouseOver = this.onCardMouseOver.bind(this);

        this.state = {
            cardToShow: ''
        };
    }

    onCardMouseOver(event) {
        var cardToDisplay = _.filter(this.props.cards, card => {
            return event.target.innerText === card.label;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getBannersToRender() {
        var banners = [];
        _.each(this.props.deck.bannerCards, (card) => {
            banners.push(<div key={ card.code ? card.code : card }><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.label }</span></div>);
        });
        return banners;
    }

    getCardsToRender() {
        var cardsToRender = [];
        var groupedCards = {};
        var combinedCards = _.union(this.props.deck.plotCards, this.props.deck.drawCards);

        _.each(combinedCards, (card) => {
            if(!groupedCards[card.card.type_name]) {
                groupedCards[card.card.type_name] = [card];
            } else {
                groupedCards[card.card.type_name].push(card);
            }
        });

        _.each(groupedCards, (cardList, key) => {
            var cards = [];
            var count = 0;

            _.each(cardList, card => {
                cards.push(<div key={ card.card.code }><span>{ card.count + 'x ' }</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.label }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(<div key={ key } className='card-group'><h4>{ key + ' (' + count.toString() + ')' }</h4>{ cards }</div>);
        });

        return cardsToRender;
    }

    render() {
        if(!this.props.deck) {
            return <div>Waiting for selected deck...</div>;
        }

        var cardsToRender = this.getCardsToRender();
        var banners = this.getBannersToRender();

        return (
            <div>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.png' } /> : null }
                <h3>{ this.props.deck.name }</h3>
                <div className='decklist'>
                    { this.props.deck.faction ? <img className='pull-left' src={ '/img/cards/' + this.props.deck.faction.value + '.png' } /> : null }
                    { this.props.deck.agenda && this.props.deck.agenda.code ? <img className='pull-right' src={ '/img/cards/' + this.props.deck.agenda.code + '.png' } /> : null }
                    <div>
                        <h4>{ this.props.deck.faction ? this.props.deck.faction.name : null }</h4>
                        <div ref='agenda'>Agenda: { this.props.deck.agenda && this.props.deck.agenda.label ? <span className='card-link' onMouseOver={ this.onCardMouseOver }
                            onMouseOut={ this.onCardMouseOut }>{ this.props.deck.agenda.label }</span> : <span>None</span> }</div>

                        { (this.props.deck.agenda && this.props.deck.agenda.label === 'Alliance') ? banners : null }

                        <div ref='drawCount'>Draw deck: { this.props.deck.validation.drawCount } cards</div>
                        <div ref='plotCount'>Plot deck: { this.props.deck.validation.plotCount } cards</div>
                        <div className={ this.props.deck.validation.status === 'Valid' ? 'text-success' : 'text-danger' }>
                            <StatusPopOver status={ this.props.deck.validation.status } list={ this.props.deck.validation.extendedStatus }
                                show={ this.props.deck.validation.status !== 'Valid' } />
                        </div>
                    </div>
                </div>
                <div className='cards'>
                    { cardsToRender }
                </div>
            </div>);
    }
}

DeckSummary.displayName = 'DeckSummary';
DeckSummary.propTypes = {
    cards: React.PropTypes.object,
    deck: React.PropTypes.object
};

export default DeckSummary;
