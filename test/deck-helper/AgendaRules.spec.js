import DeckValidator from '../../deck-helper/DeckValidator.js';
import DeckWrapper from '../../deck-helper/DeckWrapper.js';
import { deckBuilder } from '../helpers/cards.js';

const Plots = [
    'A Clash of Kings (Core)',
    'A Feast for Crows (Core)',
    'A Game of Thrones (Core)',
    'A Noble Cause (Core)',
    'A Storm of Swords (Core)',
    'Taxation (Core)',
    'Confiscation (Core)'
];

const isGuard = (card) => card.type === 'character' && card.traits.includes('Guard');

function threeOfEach(codes) {
    return codes.flatMap((code) => [code, code, code]);
}

function validate(deck) {
    return new DeckValidator([], 'joust').validateDeck(deck).extendedStatus;
}

describe('agenda deck rules', function () {
    describe('Sentinels of the Realm', function () {
        const OtherFactionGuards = deckBuilder.cards
            .filter(
                (card) =>
                    isGuard(card) &&
                    !card.loyal &&
                    !['stark', 'neutral'].includes(card.faction) &&
                    !['ToJ', 'VDS'].includes(card.packCode)
            )
            .slice(0, 4)
            .map((card) => card.code);
        const LoyalGuard = deckBuilder.cards.find(
            (card) => isGuard(card) && card.loyal && card.faction !== 'stark'
        );
        const OtherFactionNonGuard = deckBuilder.cards.find(
            (card) =>
                card.type === 'character' &&
                !card.loyal &&
                card.faction === 'lannister' &&
                !isGuard(card)
        );
        const Filler = deckBuilder.cards
            .filter(
                (card) =>
                    card.packCode === 'Core' &&
                    card.deckLimit === 3 &&
                    ['stark', 'neutral'].includes(card.faction) &&
                    ['character', 'location', 'attachment'].includes(card.type) &&
                    !isGuard(card)
            )
            .slice(0, 16)
            .map((card) => card.code);

        function deck(cards) {
            return deckBuilder.buildDeck('stark', ['Sentinels of the Realm', ...Plots, ...cards]);
        }

        function rules() {
            return new DeckValidator([], 'joust').getRules(new DeckWrapper(deck([])));
        }

        it('has the cards the tests need', function () {
            expect(OtherFactionGuards).toHaveLength(4);
            expect(LoyalGuard).toBeDefined();
            expect(OtherFactionNonGuard).toBeDefined();
            expect(Filler).toHaveLength(16);
        });

        it('lets the deck include non-loyal Guard characters from any faction', function () {
            for (const code of OtherFactionGuards) {
                expect(rules().mayInclude(deckBuilder.getCard(code))).toBe(true);
            }
        });

        it('does not let the deck include loyal Guard characters from another faction', function () {
            expect(rules().mayInclude(LoyalGuard)).toBe(false);
        });

        it('does not let the deck include other cards from another faction', function () {
            expect(rules().mayInclude(OtherFactionNonGuard)).toBe(false);
        });

        it('accepts a deck with exactly 12 Guard characters', function () {
            const status = validate(
                deck([...threeOfEach(OtherFactionGuards), ...threeOfEach(Filler)])
            );

            expect(status).not.toContain('Must contain 12 or more Guard characters');
            expect(status).not.toContainEqual(
                expect.stringContaining('Cards not allowed by faction or agenda')
            );
        });

        it('rejects a deck with 11 Guard characters', function () {
            const status = validate(
                deck([...threeOfEach(OtherFactionGuards).slice(1), ...threeOfEach(Filler)])
            );

            expect(status).toContain('Must contain 12 or more Guard characters');
        });
    });
});
