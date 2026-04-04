import { lookupCardByName } from './DeckParser';

export function deckStatusLabel(status) {
    if (!status) {
        return null;
    }

    if (!status.basicRules) {
        return 'Invalid';
    }

    if (!status.valid) {
        return 'Not Legal';
    }

    if (!status.noUnreleasedCards) {
        return 'Casual';
    }

    return 'Legal';
}

export function cardSetLabel(cardSet) {
    switch (cardSet) {
        case 'redesign':
            return 'Standard';
        case 'original':
            return 'Valyrian';
    }

    return 'Unknown';
}

const parseCardLine = (packs, cards, line) => {
    const { count, name } = parseCardCount(line);
    if (!count || count === 0 || !name) {
        return { count: 0 };
    }

    const card = lookupCardByName({
        cardName: name,
        cards: Object.values(cards),
        packs: packs
    });

    return { count: count, card: card };
};

const parseCardCount = (line) => {
    const pattern = /^(\d+)x?\s+(.+)$/;

    const match = line.trim().match(pattern);
    if (!match) {
        return { count: 0 };
    }

    const count = parseInt(match[1]);
    return { count: count, name: match[2] };
};

const addCard = (list, card, number, isDraftpool = false) => {
    let existingCard = list.find((item) => item.card === card);
    if (existingCard) {
        existingCard.count += number;
        existingCard.count = isDraftpool
            ? existingCard.count
            : Math.min(existingCard.count, card.deckLimit);
    } else {
        const count = isDraftpool ? number : Math.min(number, card.deckLimit);
        list.push({ count: count, card: card });
    }
};

export const processDeckText = (factions, packs, cards, deckText, isDraftpool = false) => {
    return (
        processThronesDbDeckText(factions, packs, cards, deckText, isDraftpool) ??
        processPlainDeckText(factions, packs, cards, deckText, isDraftpool)
    );
};

const processThronesDbDeckText = (factions, packs, cards, deckText, isDraftpool = false) => {
    let split = deckText.split('\n');
    let deckName, faction, agenda, bannerCards;

    const pool = isDraftpool ? [] : undefined;

    const headerMark = split.findIndex((line) => line.match(/^Packs:/));
    if (headerMark >= 0) {
        // ThronesDB-style deck header found
        // extract deck title, faction, agenda, and banners
        let header = split.slice(0, headerMark).filter((line) => line !== '');
        split = split.slice(headerMark);

        if (header.length >= 2) {
            deckName = header[0];

            const newFaction = Object.values(factions).find(
                (faction) => faction.name === header[1].trim()
            );
            if (newFaction) {
                faction = newFaction;
            } else {
                return;
            }

            header = header.slice(2);
            if (header.length >= 1) {
                let rawAgenda, rawBanners;

                if (
                    header.some((line) => {
                        return line.trim() === 'Alliance';
                    })
                ) {
                    rawAgenda = 'Alliance';
                    rawBanners = header.filter((line) => line.trim() !== 'Alliance');
                } else {
                    rawAgenda = header[0].trim();
                }

                const newAgenda = lookupCardByName({
                    cardName: rawAgenda,
                    cards: Object.values(cards),
                    packs: packs
                });
                if (newAgenda) {
                    agenda = newAgenda;
                    if (isDraftpool) {
                        addCard(pool, agenda, 1, isDraftpool);
                    }
                }

                if (rawBanners) {
                    const banners = [];
                    for (const rawBanner of rawBanners) {
                        const banner = lookupCardByName({
                            cardName: rawBanner,
                            cards: Object.values(cards),
                            packs: packs
                        });
                        if (banner) {
                            banners.push(banner);
                            if (isDraftpool) {
                                addCard(pool, banner, 1, isDraftpool);
                            }
                        }
                    }

                    bannerCards = banners;
                }
            }
        }
    } else {
        return null;
    }

    const plotCards = [];
    const drawCards = [];

    for (const line of split) {
        const { card, count } = parseCardLine(packs, cards, line);
        if (card) {
            addCard(card.type === 'plot' ? plotCards : drawCards, card, count, isDraftpool);
            if (isDraftpool) {
                addCard(pool, card, count, isDraftpool);
            }
        }
    }

    if (!deckName) {
        return null;
    }

    return {
        name: deckName,
        faction: faction,
        agenda: agenda,
        bannerCards: bannerCards,
        plotCards: plotCards,
        drawCards: drawCards,
        pool: pool
    };
};

const processPlainDeckText = (factions, packs, cards, deckText, isDraftpool = false) => {
    let split = deckText.split('\n');
    let faction, agenda, bannerCards;
    let sideboard = false;

    const plotCards = [];
    const drawCards = [];
    const pool = [];
    const agendaCards = new Map();

    for (const line of split) {
        if (line.trim() === '') {
            if (isDraftpool) {
                // when importing a draft pool, after the first empty line, treat all cards as sideboard cards
                // any additional cards are not included in the deck, only the pool
                sideboard = true;
            }
            continue;
        }

        let { count, name } = parseCardCount(line);
        if (!count || count === 0 || !name) {
            count = 1;
            name = line.trim();
        }
        const newFaction = Object.values(factions).find(
            (faction) => faction.name.localeCompare(name, 'en', { sensitivity: 'base' }) === 0
        );
        if (!sideboard && newFaction) {
            if (faction) {
                return null; // Faction already set, invalid deck
            }
            console.log(`Setting faction: ${newFaction.name}`);
            faction = newFaction;
        } else {
            const card = lookupCardByName({
                cardName: name,
                cards: Object.values(cards),
                packs: packs
            });
            if (card) {
                if (isDraftpool) {
                    addCard(pool, card, count, isDraftpool); // include all cards in the pool when importing a draft pool
                    if (sideboard) {
                        continue; // don't include sideboard (draft pool) cards in the deck
                    }
                }
                switch (card.type) {
                    case 'agenda':
                        agendaCards.set(card.name, card);
                        break;
                    case 'plot':
                        addCard(plotCards, card, count, isDraftpool);
                        break;
                    default:
                        addCard(drawCards, card, count, isDraftpool);
                }
            }
        }
    }

    if (!faction || !faction.value) {
        return null;
    }

    const alliance = agendaCards.get('Alliance');
    if (agendaCards.size === 1) {
        agenda = agendaCards.values().next().value;
    } else if (agendaCards.size > 1 && alliance) {
        agenda = alliance;
        agendaCards.delete(alliance.name);
        bannerCards = Array.from(agendaCards.values());
    } else if (agendaCards.size > 1) {
        return null;
    }

    return {
        name: 'Imported Deck',
        faction: faction,
        agenda: agenda,
        bannerCards: bannerCards,
        plotCards: plotCards,
        drawCards: drawCards,
        pool: pool
    };
};
