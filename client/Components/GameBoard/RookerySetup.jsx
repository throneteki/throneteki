import React, { useState, useCallback } from 'react';
import { validateDeck, formatDeckAsShortCards } from '../../../deck-helper';

import CardTiledList from './CardTiledList';
import DeckStatus from '../Decks/DeckStatus';
import Droppable from './Droppable';
import Panel from '../Site/Panel';

const RookerySetup = ({
    deck: initialDeck,
    cards,
    onSubmit,
    promptId,
    onCardMouseOut,
    onCardMouseOver,
    cardSize,
    packs,
    restrictedList
}) => {
    const [deck, setDeck] = useState({ ...initialDeck });

    const createLinearCards = useCallback(
        (cardQuantities) => {
            let results = cardQuantities.reduce((localCards, cardQuantity) => {
                let cardTemplate = cards[cardQuantity.card.code];
                let card = Object.assign({}, cardTemplate);
                if (cardQuantity.count > 1) {
                    card.tokens = { count: cardQuantity.count };
                }

                let attachmentCount = cardQuantity.count - 1;
                if (attachmentCount < 0) {
                    attachmentCount = 0;
                }

                card.attachments = new Array(attachmentCount).fill(Object.assign({}, cardTemplate));
                return localCards.concat([card]);
            }, []);

            results.sort((a, b) => (a.name <= b.name ? -1 : 1));
            return results;
        },
        [cards]
    );

    const addCardToPile = useCallback((card, pile) => {
        setDeck((prevDeck) => {
            let newDeck = { ...prevDeck };
            if (!newDeck[pile]) {
                newDeck[pile] = {};
            }
            if (!newDeck[pile][card.code]) {
                newDeck[pile][card.code] = 0;
            }
            newDeck[pile][card.code]++;
            return newDeck;
        });
    }, []);

    const removeCardFromPile = useCallback((card, pile) => {
        setDeck((prevDeck) => {
            let newDeck = { ...prevDeck };
            if (!newDeck[pile] || !newDeck[pile][card.code]) {
                return newDeck;
            }
            newDeck[pile][card.code]--;
            if (newDeck[pile][card.code] <= 0) {
                delete newDeck[pile][card.code];
            }
            return newDeck;
        });
    }, []);

    const moveCardBetweenDecks = useCallback(
        (card, source) => {
            if (source === 'rookery') {
                removeCardFromPile(card, 'rookery');
                addCardToPile(card, 'deck');
            } else {
                removeCardFromPile(card, 'deck');
                addCardToPile(card, 'rookery');
            }
        },
        [addCardToPile, removeCardFromPile]
    );

    const handleDragDrop = useCallback(
        (card, source) => {
            moveCardBetweenDecks(card, source);
        },
        [moveCardBetweenDecks]
    );

    const handleDoneClick = useCallback(() => {
        onSubmit(formatDeckAsShortCards(deck), promptId);
    }, [deck, onSubmit, promptId]);

    const getGroupedCards = useCallback((cards) => {
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
    }, []);

    if (!cards) {
        return <div>Waiting for cards to load...</div>;
    }

    let rookeryCards = createLinearCards(deck.rookeryCards);
    let deckCards = createLinearCards(deck.plotCards).concat(createLinearCards(deck.drawCards));
    let status = validateDeck(deck, {
        packs: packs,
        restrictedLists: restrictedList
    });

    return (
        <div className='rookery'>
            <div className='rookery-status'>
                <h4>Click cards to move them between your rookery and deck</h4>
                <div>
                    <DeckStatus status={status} />
                    <button className='btn btn-primary btn-rookery-done' onClick={handleDoneClick}>
                        Done
                    </button>
                </div>
            </div>
            <div className='rookery-deck'>
                <Panel title='Rookery' className='rookery-cards rookery-panel'>
                    <Droppable source='rookery' onDragDrop={handleDragDrop}>
                        <CardTiledList
                            cards={rookeryCards}
                            onCardClick={(card) => moveCardBetweenDecks(card, 'rookery')}
                            onCardMouseOut={onCardMouseOut}
                            onCardMouseOver={onCardMouseOver}
                            size={cardSize}
                            source='rookery'
                        />
                    </Droppable>
                </Panel>
                <div className='rookery-arrows'>
                    <span className='glyphicon glyphicon-arrow-left' />
                    <span className='glyphicon glyphicon-arrow-right' />
                </div>
                <Panel title='Deck' className='rookery-deck-cards rookery-panel'>
                    <Droppable source='full deck' onDragDrop={handleDragDrop}>
                        {getGroupedCards(deckCards).map((group) => (
                            <CardTiledList
                                key={group.type}
                                cards={group.cards}
                                onCardClick={(card) => moveCardBetweenDecks(card, 'full deck')}
                                onCardMouseOut={onCardMouseOut}
                                onCardMouseOver={onCardMouseOver}
                                size={cardSize}
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
};

export default RookerySetup;
