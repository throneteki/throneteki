/**
 * Creates a clone of the existing deck with full card data filled in instead of
 * just card codes. If the passed in deck is already formatted properly, nothing will change
 *
 * @param {object} deck
 * @param {object} data
 * @param {object} data.cards - an index of card code to full card object
 * @param {object} data.factions - an index of faction code to full faction object
 */
export function formatDeckAsFullCards(deck, { cards = [], factions = [] }) {
    const newDeck = {
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

    if (factions.length > 0) {
        newDeck.faction = factions[deck.faction.value];
    }

    if (deck.agenda) {
        newDeck.agenda = processCard(deck.agenda, cards);
    }

    newDeck.bannerCards =
        deck.bannerCards?.map((card) => processCard(card, cards)).filter((card) => !!card) ?? [];
    newDeck.draftedCards = deck.draftedCards ?? [];
    newDeck.drawCards = processCardCounts(deck.drawCards ?? [], cards);
    newDeck.plotCards = processCardCounts(deck.plotCards ?? [], cards);

    newDeck.plotCount = newDeck.plotCards.reduce((total, curr) => (total += curr.count), 0);
    newDeck.drawCount = newDeck.drawCards.reduce((total, curr) => (total += curr.count), 0);

    return newDeck;
}

function processCard(cardOrCode, cardData) {
    // Already processed/converted card
    if (typeof cardOrCode === 'object') {
        return cardOrCode;
    }
    // Otherwise, is code string
    return cardData[cardOrCode];
}

function processCardCounts(cardCounts, cardData) {
    const cardCountsWithData = cardCounts.map((cardCount) => {
        return {
            count: cardCount.count,
            card: processCard(cardCount.cardcode ?? cardCount.card, cardData)
        };
    });

    // Filter out any cards that aren't available in the card data.
    return cardCountsWithData.filter((cardCount) => !!cardCount.card);
}
