/**
 * Creates a clone of the existing deck with full card data filled in instead of
 * just card codes.
 *
 * @param {object} deck
 * @param {object} data
 * @param {object} data.cards - an index of card code to full card object
 * @param {object} data.factions - an index of faction code to full faction object
 */
export function formatDeckAsFullCards(deck, data) {
    let newDeck = {
        _id: deck._id,
        draftCubeId: deck.draftCubeId,
        eventId: deck.eventId,
        locked: deck.locked,
        format: deck.format,
        name: deck.name,
        username: deck.username,
        lastUpdated: deck.lastUpdated,
        isFavourite: !!deck.isFavourite,
        faction: Object.assign({}, deck.faction)
    };

    if (data.factions) {
        newDeck.faction = data.factions[deck.faction.value];
    }

    if (deck.agenda) {
        newDeck.agenda = data.cards[deck.agenda];
    }

    newDeck.bannerCards = (deck.bannerCards || []).map((card) => data.cards[card]);
    newDeck.draftedCards = deck.draftedCards || [];
    newDeck.drawCards = processCardCounts(deck.drawCards || [], data.cards);
    newDeck.plotCards = processCardCounts(deck.plotCards || [], data.cards);

    newDeck.plotCount = newDeck.plotCards.reduce((total, curr) => (total += curr.count), 0);
    newDeck.drawCount = newDeck.drawCards.reduce((total, curr) => (total += curr.count), 0);

    return newDeck;
}

function processCardCounts(cardCounts, cardData) {
    let cardCountsWithData = cardCounts.map((cardCount) => {
        return {
            count: cardCount.count,
            card: cardData[cardCount.cardcode]
        };
    });

    // Filter out any cards that aren't available in the card data.
    return cardCountsWithData.filter((cardCount) => !!cardCount.card);
}
