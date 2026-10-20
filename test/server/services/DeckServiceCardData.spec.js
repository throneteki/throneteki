import DeckService from '../../../server/services/DeckService.js';
import { deckBuilder } from '../../helpers/cards.js';

const Legality = { name: 'Test', restricted: [], banned: [], pods: [] };

function fakeCardService(cards) {
    return {
        cards,
        getAllCards: async function () {
            return Object.fromEntries(this.cards.map((card) => [card.code, card]));
        },
        getAllPacks: async () => [
            ...new Map(
                deckBuilder.cards.map((card) => [
                    card.packCode,
                    { code: card.packCode, releaseDate: card.releaseDate }
                ])
            ).values()
        ],
        processLegality: async () => Legality
    };
}

describe('DeckService card data', function () {
    const sentinels = deckBuilder.getCard('Sentinels of the Realm');
    const otherFactionGuard = deckBuilder.cards.find(
        (card) =>
            card.type === 'character' &&
            card.traits.includes('Guard') &&
            !card.loyal &&
            card.faction === 'martell'
    );

    function sentinelsDeck() {
        return {
            format: 'joust',
            variant: 'standard',
            faction: { value: 'stark' },
            agenda: sentinels.code,
            bannerCards: [],
            plotCards: [],
            drawCards: [{ cardcode: otherFactionGuard.code, count: 1 }]
        };
    }

    async function validate(deckService) {
        const deck = await deckService.processDeck(sentinelsDeck(), {
            format: 'joust',
            variant: 'standard',
            legality: 'latest'
        });
        return deck.status.extendedStatus;
    }

    describe('when a pack is imported after the service has loaded its cards', function () {
        beforeEach(async function () {
            this.cardService = fakeCardService(
                deckBuilder.cards.filter((card) => card.code !== sentinels.code)
            );
            this.deckService = new DeckService(this.cardService, {});
            await this.deckService.init();

            this.cardService.cards = deckBuilder.cards;
        });

        it("applies the new agenda's deck rules", async function () {
            const status = await validate(this.deckService);

            expect(status).not.toContainEqual(
                expect.stringContaining('Cards not allowed by faction or agenda')
            );
            expect(status).toContain('Must contain 12 or more Guard characters');
        });

        it('only reloads the cards once for codes that do not exist', async function () {
            const getAllCards = vi.spyOn(this.cardService, 'getAllCards');
            const deck = { ...sentinelsDeck(), agenda: '99999' };
            const options = { format: 'joust', variant: 'standard', legality: 'latest' };

            await this.deckService.processDeck(deck, options);
            await this.deckService.processDeck({ ...deck }, options);

            expect(getAllCards).toHaveBeenCalledTimes(1);
        });
    });
});
