/*eslint no-console:0 */

const monk = require('monk');
const ServiceFactory = require('../services/ServiceFactory.js');

class ExportStandaloneDecks {
    constructor() {
        let configService = ServiceFactory.configService();
        this.db = monk(configService.getValue('dbPath'));
        this.cardService = ServiceFactory.cardService(this.db);
        this.deckService = ServiceFactory.deckService(this.db);
    }

    async export(name) {
        try {
            await this.deckService.init();
            this.cards = await this.cardService.getAllCards();

            const deck = await this.deckService.getByName(name);
            const exportedFormat = {
                id: null,
                name: deck.name,
                releaseDate: null,
                faction: deck.faction.value,
                agenda: deck.agenda.code,
                cards: deck.plotCards
                    .map((c) => ({ code: c.card.code, count: c.count }))
                    .concat(deck.drawCards.map((c) => ({ code: c.card.code, count: c.count })))
            };
            console.log(JSON.stringify(exportedFormat));
        } finally {
            this.db.close();
        }
    }
}

let importer = new ExportStandaloneDecks();
importer.export(process.argv[2]);
