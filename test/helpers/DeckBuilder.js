/*eslint no-console:0 */

import fs from 'fs';

import path from 'path';

import { matchCardByNameAndPack } from './cardutil.js';

import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);

class DeckBuilder {
    async loadCards(directory) {
        let cards = {};

        let jsonPacks = fs.readdirSync(directory).filter((file) => file.endsWith('.json'));

        for (let file of jsonPacks) {
            let pack = require(path.join(directory, file));

            for (let card of pack.cards) {
                card.packCode = pack.code;
                card.releaseDate = pack.releaseDate;
                cards[card.code] = card;
            }
        }

        this.cardsByCode = cards;
        this.cards = Object.values(this.cardsByCode);
        addLabels(this.cards);
    }

    buildDeck(faction, cardLabels, { strictNames = false } = {}) {
        let allCards = this.createCardCounts(cardLabels, { strictNames });

        let agendas = allCards
            .filter((cardCount) => cardCount.card.type === 'agenda')
            .map((cardCount) => cardCount.card);
        let agenda = agendas[0];
        let bannerCards = [];

        if (agendas.length > 1) {
            // Assume multi-agenda decks are Alliance
            agenda = agendas.find((card) => card.name === 'Alliance');
            if (!agenda) {
                throw new Error(
                    `A deck with several agendas needs Alliance: ${agendas.map((card) => card.name).join(', ')}`
                );
            }
            bannerCards = agendas.filter((card) => card.name !== 'Alliance');
        }

        return {
            faction: { value: faction },
            agenda: agenda,
            bannerCards: bannerCards,
            drawCards: allCards.filter((cardCount) =>
                ['character', 'location', 'attachment', 'event'].includes(cardCount.card.type)
            ),
            plotCards: allCards.filter((cardCount) => cardCount.card.type === 'plot')
        };
    }

    createCardCounts(cardLabels, options) {
        let cardCounts = {};
        for (let label of cardLabels) {
            let cardName = label;
            let count = 1;
            if (typeof label !== 'string') {
                cardName = label.name;
                count = label.count;
            }

            let cardData = this.getCard(cardName, options);
            if (cardCounts[cardData.code]) {
                cardCounts[cardData.code].count += count;
            } else {
                cardCounts[cardData.code] = {
                    count: count,
                    card: cardData
                };
            }
        }
        return Object.values(cardCounts);
    }

    getCard(codeOrLabelOrName, { strictNames = false } = {}) {
        if (this.cardsByCode[codeOrLabelOrName]) {
            return this.cardsByCode[codeOrLabelOrName];
        }

        let cardsByName = this.cards.filter(matchCardByNameAndPack(codeOrLabelOrName));

        if (cardsByName.length === 0) {
            throw new Error(`Unable to find any card matching ${codeOrLabelOrName}`);
        }

        if (cardsByName.length > 1) {
            cardsByName.sort((a, b) => (a.releaseDate < b.releaseDate ? -1 : 1));
            let matchingLabels = cardsByName
                .map((card) => `${card.name} (${card.packCode})`)
                .join('\n');
            const message = `Multiple cards match the name ${codeOrLabelOrName}. Use one of these instead:\n${matchingLabels}`;
            if (strictNames) {
                throw new Error(message);
            }
            console.warn(message);
        }

        return cardsByName[0];
    }
}

function addLabels(cards) {
    const countsByName = new Map();
    for (const card of cards) {
        countsByName.set(card.name, (countsByName.get(card.name) || 0) + 1);
    }

    for (const card of cards) {
        card.label =
            countsByName.get(card.name) > 1 ? `${card.name} (${card.packCode})` : card.name;
    }
}

export default DeckBuilder;
