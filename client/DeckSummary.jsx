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

    hasTrait(card, trait) {
        return card.traits && card.traits.toLowerCase().indexOf(trait.toLowerCase() + '.') !== -1;
    }

    onCardMouseOver(event) {
        let cardToDisplay = _.filter(this.props.cards, card => {
            return event.target.innerText === card.label;
        });

        this.setState({ cardToShow: cardToDisplay[0] });
    }

    onCardMouseOut() {
        this.setState({ cardToShow: undefined });
    }

    getBannersToRender() {
        let banners = [];
        _.each(this.props.deck.bannerCards, (card) => {
            banners.push(<div className='pull-right' key={ card.code ? card.code : card }>
                <span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.label }</span>
            </div>);
        });

        return <div className='info-row row'><span>Banners:</span>{ banners }</div>;
    }

    getCardsToRender() {
        let cardsToRender = [];
        let groupedCards = {};
        let combinedCards = _.union(this.props.deck.plotCards, this.props.deck.drawCards);

        _.each(combinedCards, (card) => {
            let type = card.card.type_name;

            if(this.props.deck.agenda && this.props.deck.agenda.code === '05045') {
                if(this.hasTrait(card.card, 'scheme')) {
                    type = 'Scheme';
                }
            }

            if(!groupedCards[type]) {
                groupedCards[type] = [card];
            } else {
                groupedCards[type].push(card);
            }
        });

        _.each(groupedCards, (cardList, key) => {
            let cards = [];
            let count = 0;

            _.each(cardList, card => {
                cards.push(<div key={ card.card.code }><span>{ card.count + 'x ' }</span><span className='card-link' onMouseOver={ this.onCardMouseOver } onMouseOut={ this.onCardMouseOut }>{ card.card.label }</span></div>);
                count += parseInt(card.count);
            });

            cardsToRender.push(
                <div className='cards-no-break'>
                    <div className='card-group-title'>{ key + ' (' + count.toString() + ')' }</div>
                    <div key={ key } className='card-group'>{ cards }</div>
                </div>);
        });

        return cardsToRender;
    }

    render() {
        if(!this.props.deck) {
            return <div>Waiting for selected deck...</div>;
        }

        let cardsToRender = this.getCardsToRender();
        let banners = this.getBannersToRender();

        return (
            <div className='deck-summary'>
                { this.state.cardToShow ? <img className='hover-image' src={ '/img/cards/' + this.state.cardToShow.code + '.png' } /> : null }
                <div className='decklist'>
                    <div className='col-xs-2 col-sm-3'>{ this.props.deck.faction ? <img className='img-responsive' src={ '/img/cards/' + this.props.deck.faction.value + '.png' } /> : null }</div>
                    <div className='col-xs-8 col-sm-6'>
                        <div className='info-row row'><span>Faction:</span>{ this.props.deck.faction ? <span className={ 'pull-right' }>{ this.props.deck.faction.name }</span> : null }</div>
                        <div className='info-row row' ref='agenda'><span>Agenda:</span> { this.props.deck.agenda && this.props.deck.agenda.label ? <span className='pull-right card-link' onMouseOver={ this.onCardMouseOver }
                            onMouseOut={ this.onCardMouseOut }>{ this.props.deck.agenda.label }</span> : <span>None</span> }</div>
                        { (this.props.deck.agenda && this.props.deck.agenda.label === 'Alliance') ? banners : null }
                        <div className='info-row row' ref='drawCount'><span>Draw deck:</span><span className='pull-right'>{ this.props.deck.validation.drawCount } cards</span></div>
                        <div className='info-row row' ref='plotCount'><span>Plot deck:</span><span className='pull-right'>{ this.props.deck.validation.plotCount } cards</span></div>
                    </div>
                    <div className='col-xs-2 col-sm-3'>{ this.props.deck.agenda && this.props.deck.agenda.code ? <img className='img-responsive' src={ '/img/cards/' + this.props.deck.agenda.code + '.png' } /> : null }</div>
                    <div className='col-xs-2'>
                        <div className={ this.props.deck.validation.status === 'Valid' ? 'deck-status valid' : 'deck-status invalid' }>
                            <StatusPopOver status={ this.props.deck.validation.status } list={ this.props.deck.validation.extendedStatus }
                                show={ this.props.deck.validation.status !== 'Valid' } />
                        </div>
                    </div>
                </div>
                <div className='col-xs-12'>
                    <div className='cards'>
                        { cardsToRender }
                    </div>
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
