/**
 * Creates a clone of the existing deck with only card codes instead of full
 * card data.
 */
export function formatDeckAsShortCards(deck) {
    let newDeck = {
        _id: deck._id,
        draftCubeId: deck.draftCubeId,
        eventId: deck.eventId,
        locked: deck.locked,
        name: deck.name,
        username: deck.username,
        lastUpdated: deck.lastUpdated,
        faction: { name: deck.faction.name, value: deck.faction.value },
        format: deck.format
    };

    if(deck.agenda) {
        newDeck.agenda = { code: deck.agenda.code };
    }

    newDeck.bannerCards = (deck.bannerCards || []).map(card => ({ code: card.code }));
    newDeck.drawCards = formatCards(deck.drawCards || []);
    newDeck.plotCards = formatCards(deck.plotCards || []);

    return newDeck;
}

function formatCards(cardCounts) {
    return cardCounts.map(cardCount => {
        return { count: cardCount.count, card: cardCount.card.custom ? cardCount.card : { code: cardCount.card.code } };
    });
}
