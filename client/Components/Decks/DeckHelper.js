import { lookupCardByName } from './DeckParser';

export function deckStatusLabel(status) {
    if (!status.basicRules) {
        return 'Invalid';
    }

    if (!status.noBannedCards) {
        return 'Banned';
    }

    if (!status.faqJoustRules || !status.noUnreleasedCards) {
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
    const pattern = /^(\d+)x?\s+(.+)$/;

    const match = line.trim().match(pattern);
    if (!match) {
        return { count: 0 };
    }

    const count = parseInt(match[1]);
    const card = lookupCardByName({
        cardName: match[2],
        cards: Object.values(cards),
        packs: packs
    });

    return { count: count, card: card };
};

const addCard = (list, card, number) => {
    const cardCode = parseInt(card.code);
    if (list[cardCode]) {
        list[cardCode].count += number;
    } else {
        list.push({ count: number, card: card });
    }
};

export const processThronesDbDeckText = (factions, packs, cards, deckText) => {
    let split = deckText.split('\n');
    let deckName, faction, agenda, bannerCards;

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
            addCard(card.type === 'plot' ? plotCards : drawCards, card, count);
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
        drawCards: drawCards
    };
};
