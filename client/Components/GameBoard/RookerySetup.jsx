import React from 'react';
import PropTypes from 'prop-types';
import { validateDeck, formatDeckAsShortCards } from '../../../deck-helper';

import CardTiledList from './CardTiledList';
import DeckStatus from '../Decks/DeckStatus';
import Droppable from './Droppable';
import Panel from '../Site/Panel';

class RookerySetup extends React.Component {
    constructor(props) {
        super(props);

        this.handleDragDrop = this.handleDragDrop.bind(this);
        this.handleDoneClick = this.handleDoneClick.bind(this);

        this.state = {
            deck: Object.assign({}, props.deck)
        };
    }

    createLinearCards(cardQuantities) {
        let results = cardQuantities.reduce((cards, cardQuantity) => {
            let cardTemplate = this.props.cards[cardQuantity.card.code];
            let card = Object.assign({}, cardTemplate);
            if (cardQuantity.count > 1) {
                card.tokens = { count: cardQuantity.count };
            }

            let attachmentCount = cardQuantity.count - 1;
            if (attachmentCount < 0) {
                attachmentCount = 0;
            }

            card.attachments = new Array(attachmentCount).fill(Object.assign({}, cardTemplate));
            return cards.concat([card]);
        }, []);

        results.sort((a, b) => (a.name <= b.name ? -1 : 1));
        return results;
    }

    handlerCardClick(source, card) {
        this.moveCardBetweenDecks(card, source);
    }

    moveCardBetweenDecks(card, source) {
        let newRookeryCards = this.state.deck.rookeryCards;
        let newPlotCards = this.state.deck.plotCards;
        let newDrawCards = this.state.deck.drawCards;
        if (source === 'rookery') {
            newRookeryCards = this.removeCardFromPile(card, newRookeryCards);

            if (card.type === 'plot') {
                newPlotCards = this.addCardToPile(card, newPlotCards);
            } else {
                newDrawCards = this.addCardToPile(card, newDrawCards);
            }
        } else {
            if (card.type === 'plot') {
                newPlotCards = this.removeCardFromPile(card, newPlotCards);
            } else {
                newDrawCards = this.removeCardFromPile(card, newDrawCards);
            }

            newRookeryCards = this.addCardToPile(card, newRookeryCards);
        }

        let newDeck = Object.assign({}, this.state.deck);
        newDeck.rookeryCards = newRookeryCards;
        newDeck.drawCards = newDrawCards;
        newDeck.plotCards = newPlotCards;
        this.setState({ deck: newDeck });
    }

    addCardToPile(card, pile) {
        let existingQuantity = pile.find((cardQuantity) => cardQuantity.card.code === card.code);

        if (!existingQuantity) {
            return pile.concat({ count: 1, card: card });
        }

        existingQuantity.count += 1;
        return pile;
    }

    removeCardFromPile(card, pile) {
        let existingQuantity = pile.find((cardQuantity) => cardQuantity.card.code === card.code);

        if (existingQuantity.count === 1) {
            return pile.filter((cardQuantity) => cardQuantity.card.code !== card.code);
        }

        existingQuantity.count -= 1;
        return pile;
    }

    handleDragDrop(card, source) {
        this.moveCardBetweenDecks(card, source);
    }

    handleDoneClick() {
        this.props.onSubmit(formatDeckAsShortCards(this.state.deck), this.props.promptId);
    }

    getGroupedCards(cards) {
        const cardGroups = [
            { title: 'Plots', type: 'plot' },
            { title: 'Characters', type: 'character' },
            { title: 'Locations', type: 'location' },
            { title: 'Attachments', type: 'attachment' },
            { title: 'Events', type: 'event' }
        ];

        let groupedCards = cardGroups.map((group) => {
            let filteredCards = cards.filter((card) => card.type === group.type);
            let cardCount = filteredCards.reduce(
                (sum, card) => sum + (card.tokens ? card.tokens.count : 1),
                0
            );
            return Object.assign({ cards: filteredCards, cardCount: cardCount }, group);
        });

        return groupedCards.filter((group) => group.cards.length !== 0);
    }

    render() {
        if (!this.props.cards) {
            return <div>Waiting for cards to load...</div>;
        }

        let deck = this.state.deck;
        let rookeryCards = this.createLinearCards(deck.rookeryCards);
        let deckCards = this.createLinearCards(deck.plotCards).concat(
            this.createLinearCards(deck.drawCards)
        );
        let status = validateDeck(deck, {
            packs: this.props.packs,
            restrictedLists: this.props.restrictedList
        });

        return (
            <div className='rookery'>
                <div className='rookery-status'>
                    <h4>Click cards to move them between your rookery and deck</h4>
                    <div>
                        <DeckStatus status={status} />
                        <button
                            className='btn btn-primary btn-rookery-done'
                            onClick={this.handleDoneClick}
                        >
                            Done
                        </button>
                    </div>
                </div>
                <div className='rookery-deck'>
                    <Panel title='Rookery' className='rookery-cards rookery-panel'>
                        <Droppable source='rookery' onDragDrop={this.handleDragDrop}>
                            <CardTiledList
                                cards={rookeryCards}
                                onCardClick={this.handlerCardClick.bind(this, 'rookery')}
                                onCardMouseOut={this.props.onCardMouseOut}
                                onCardMouseOver={this.props.onCardMouseOver}
                                size={this.props.cardSize}
                                source='rookery'
                            />
                        </Droppable>
                    </Panel>
                    <div className='rookery-arrows'>
                        <span className='glyphicon glyphicon-arrow-left' />
                        <span className='glyphicon glyphicon-arrow-right' />
                    </div>
                    <Panel title='Deck' className='rookery-deck-cards rookery-panel'>
                        <Droppable source='full deck' onDragDrop={this.handleDragDrop}>
                            {this.getGroupedCards(deckCards).map((group) => (
                                <CardTiledList
                                    key={group.type}
                                    cards={group.cards}
                                    onCardClick={this.handlerCardClick.bind(this, 'full deck')}
                                    onCardMouseOut={this.props.onCardMouseOut}
                                    onCardMouseOver={this.props.onCardMouseOver}
                                    size={this.props.cardSize}
                                    source='full deck'
                                    title={group.title}
                                    titleCount={group.cardCount}
                                />
                            ))}
                        </Droppable>
                    </Panel>
                </div>
            </div>
        );
    }
}

RookerySetup.propTypes = {
    cardSize: PropTypes.string,
    cards: PropTypes.object,
    deck: PropTypes.object,
    onCardMouseOut: PropTypes.func,
    onCardMouseOver: PropTypes.func,
    onSubmit: PropTypes.func,
    packs: PropTypes.array,
    players: PropTypes.array,
    promptId: PropTypes.string,
    restrictedList: PropTypes.array
};

export default RookerySetup;
