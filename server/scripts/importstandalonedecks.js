/*eslint no-console:0 */

import fs from 'fs';

import path from 'path';
import monk from 'monk';
import ServiceFactory from '../services/ServiceFactory.js';

const __dirname = import.meta.dirname;

class ImportStandaloneDecks {
    constructor() {
        let configService = ServiceFactory.configService();
        this.db = monk(configService.getValue('dbPath'));
        this.cardService = ServiceFactory.cardService(this.db);
        this.deckService = ServiceFactory.deckService(this.db);
    }

    async import() {
        try {
            await this.deckService.init();
            this.cards = await this.cardService.getAllCards();

            for (let deck of this.loadDecks()) {
                let existingDeck = await this.deckService.getByStandaloneId(deck.id);
                if (!existingDeck) {
                    let formattedDeck = this.formatDeck(deck);
                    console.log('Importing', formattedDeck.name);
                    await this.deckService.createStandalone(formattedDeck);
                }
            }
            console.log('Done importing standalone decks');
        } catch (err) {
            console.error('Could not finish import', err);
        } finally {
            this.db.close();
        }
    }

    loadDecks() {
        let data = fs.readFileSync(
            path.join(__dirname, '../../throneteki-json-data/standalone-decks.json')
        );
        return JSON.parse(data);
    }

    formatDeck(deck) {
        let drawCards = deck.cards.filter((card) =>
            ['attachment', 'character', 'event', 'location'].includes(this.cards[card.code].type)
        );
        let plotCards = deck.cards.filter((card) => this.cards[card.code].type === 'plot');
        let formattedDeck = {
            standaloneDeckId: deck.id,
            bannerCards: [],
            name: deck.name,
            faction: { value: deck.faction },
            drawCards: drawCards.map((card) => ({ count: card.count, card: { code: card.code } })),
            plotCards: plotCards.map((card) => ({ count: card.count, card: { code: card.code } })),
            lastUpdated: new Date(deck.releaseDate)
        };

        if (deck.agenda) {
            formattedDeck.agenda = { code: deck.agenda };
        }

        return formattedDeck;
    }
}

let importer = new ImportStandaloneDecks();
importer.import();
