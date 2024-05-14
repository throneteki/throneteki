/*eslint no-console:0 */

import fs from 'fs';

import path from 'path';
import url from 'url';

import { matchCardByNameAndPack } from './cardutil.js';

class DeckBuilder {
    async loadCards(directory) {
        let cards = {};

        let jsonPacks = fs.readdirSync(directory).filter((file) => file.endsWith('.json'));

        for (let file of jsonPacks) {
            let pack = await import(url.pathToFileURL(path.join(directory, file)), {
                assert: { type: 'json' }
            });

            for (let card of pack.default.cards) {
                card.packCode = pack.default.code;
                card.releaseDate = pack.default.releaseDate;
                cards[card.code] = card;
            }
        }

        this.cardsByCode = cards;
        this.cards = Object.values(this.cardsByCode);
    }

    buildDeck(faction, cardLabels) {
        let allCards = this.createCardCounts(cardLabels);

        let agendas = allCards
            .filter((cardCount) => cardCount.card.type === 'agenda')
            .map((cardCount) => cardCount.card);
        let agenda = agendas[0];
        let bannerCards = [];

        if (agendas.length > 1) {
            // Assume multi-agenda decks are Alliance
            agenda = agendas.find((card) => card.name === 'Alliance');
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

    createCardCounts(cardLabels) {
        let cardCounts = {};
        for (let label of cardLabels) {
            let cardName = label;
            let count = 1;
            if (typeof label !== 'string') {
                cardName = label.name;
                count = label.count;
            }

            let cardData = this.getCard(cardName);
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

    getCard(codeOrLabelOrName) {
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
            console.warn(
                `Multiple cards match the name ${codeOrLabelOrName}. Use one of these instead:\n${matchingLabels}`
            );
        }

        return cardsByName[0];
    }
}

export default DeckBuilder;
