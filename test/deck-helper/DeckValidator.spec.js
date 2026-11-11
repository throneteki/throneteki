import fs from 'fs';
import path from 'path';
import DeckValidator from '../../deck-helper/DeckValidator.js';
import { deckBuilder } from '../helpers/cards.js';

const packsDirectory = path.join(import.meta.dirname, '../../throneteki-json-data/packs');
const packs = fs
    .readdirSync(packsDirectory)
    .filter((file) => file.endsWith('.json'))
    .map((file) => JSON.parse(fs.readFileSync(path.join(packsDirectory, file), 'utf8')))
    .map((pack) => ({ code: pack.code, releaseDate: pack.releaseDate }));

const Plots = [
    'A Clash of Kings (Core)',
    'A Feast for Crows (Core)',
    'A Game of Thrones (Core)',
    'A Noble Cause (Core)',
    'Taxation (Core)',
    'A Storm of Swords (Core)',
    'Confiscation (Core)'
];

const DrawCards = deckBuilder.cards
    .filter(
        (card) =>
            card.packCode === 'Core' &&
            ['stark', 'neutral'].includes(card.faction) &&
            ['character', 'location', 'attachment'].includes(card.type) &&
            card.deckLimit === 3 &&
            card.name !== 'Winterfell Steward'
    )
    .slice(0, 20)
    .map((card) => card.code);

function times(count, label) {
    return Array(count).fill(label);
}

function deckOf({ plots = Plots, draw = DrawCards.flatMap((label) => times(3, label)) }) {
    return deckBuilder.buildDeck('stark', [...plots, ...draw]);
}

function validate(deck, validatorPacks = packs) {
    return new DeckValidator(validatorPacks, 'joust').validateDeck(deck);
}

describe('DeckValidator', function () {
    it('has enough distinct Core cards to build a deck', function () {
        expect(DrawCards).toHaveLength(20);
    });

    it('accepts a joust deck with 7 plots and 60 draw cards', function () {
        const result = validate(deckOf({}));

        expect(result.extendedStatus).toEqual([]);
        expect(result.basicRules).toBe(true);
    });

    it('rejects too few or too many plots', function () {
        expect(validate(deckOf({ plots: Plots.slice(0, 6) })).extendedStatus).toContain(
            'Too few plot cards'
        );
        expect(
            validate(deckOf({ plots: [...Plots, 'Wildfire Assault (Core)'] })).extendedStatus
        ).toContain('Too many plot cards');
    });

    it('rejects fewer than 60 draw cards', function () {
        const draw = DrawCards.flatMap((label) => times(3, label)).slice(1);

        expect(validate(deckOf({ draw })).extendedStatus).toContain('Too few draw cards');
    });

    it('allows one doubled plot but not two', function () {
        const onePair = [...Plots.slice(0, 5), Plots[0], Plots[1]];
        const twoPairs = [...Plots.slice(0, 5), Plots[0], Plots[0]];

        expect(validate(deckOf({ plots: onePair })).extendedStatus).toContain(
            'Maximum allowed number of doubled plots: 1'
        );
        expect(validate(deckOf({ plots: twoPairs })).extendedStatus).toContain(
            'A Clash of Kings has limit 2'
        );
        expect(
            validate(deckOf({ plots: [...Plots.slice(0, 6), Plots[0]] })).extendedStatus
        ).toEqual([]);
    });

    it('rejects more copies of a card than its deck limit', function () {
        const draw = [
            ...DrawCards.slice(1).flatMap((label) => times(3, label)),
            ...times(4, DrawCards[0])
        ];
        const name = deckBuilder.getCard(DrawCards[0]).name;

        expect(validate(deckOf({ draw })).extendedStatus).toContain(`${name} has limit 3`);
    });

    it("rejects cards from another faction, but not the deck's own faction", function () {
        const own = [...DrawCards.flatMap((label) => times(3, label)), 'Winterfell Steward'];
        const other = [...DrawCards.flatMap((label) => times(3, label)), 'Lannisport Merchant'];

        expect(validate(deckOf({ draw: own })).extendedStatus).toEqual([]);
        expect(validate(deckOf({ draw: other })).extendedStatus).toEqual([
            expect.stringContaining('Cards not allowed by faction or agenda')
        ]);
    });

    it('rejects draft cards in joust', function () {
        const draw = [...DrawCards.flatMap((label) => times(3, label)), '00294'];

        expect(validate(deckOf({ draw })).extendedStatus).toContain(
            'You cannot include Draft cards in your deck'
        );
    });

    it('rejects cards from packs that are not released yet', function () {
        const unreleased = packs.map((pack) =>
            pack.code === 'Core' ? { ...pack, releaseDate: '2999-01-01' } : pack
        );

        expect(validate(deckOf({}), unreleased).noUnreleasedCards).toBe(false);
    });
});
