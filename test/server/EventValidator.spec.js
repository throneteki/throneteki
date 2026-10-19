import cards from '../../server/game/cards/index.js';
import Event from '../../server/game/event.js';
import Game from '../../server/game/game.js';
import { checkEventName, EventValidator } from '../../server/game/EventValidator.js';

function registeredEventNames(card) {
    const triggers = card.abilities.reactions.flatMap((ability) =>
        (ability.abilityTriggers || []).map((trigger) => trigger.eventName)
    );
    const registrations = card.eventsForRegistration.flatMap((event) =>
        typeof event === 'string' ? [event] : Object.keys(event)
    );

    return [...triggers, ...registrations];
}

describe('EventValidator', function () {
    beforeEach(function () {
        this.validator = new EventValidator();
    });

    describe('checkListener()', function () {
        it('accepts catalogued events, with or without a window suffix', function () {
            expect(() => this.validator.checkListener('onCardKneeled')).not.toThrow();
            expect(() => this.validator.checkListener('onCardKneeled:reaction')).not.toThrow();
            expect(() =>
                this.validator.checkListener('onCardDiscarded:aggregate:interrupt')
            ).not.toThrow();
        });

        it('accepts notifications and internal events', function () {
            expect(() => this.validator.checkListener('onGameOver')).not.toThrow();
            expect(() => this.validator.checkListener('reaction')).not.toThrow();
            expect(() => this.validator.checkListener('__PLACEHOLDER_EVENT__')).not.toThrow();
        });

        it('rejects events that are not catalogued', function () {
            expect(() => this.validator.checkListener('onCardKnelt')).toThrow(
                /Unknown event 'onCardKnelt'/
            );
        });

        it('rejects unknown window suffixes', function () {
            expect(() => this.validator.checkListener('onCardKneeled:reactoin')).toThrow(
                /Unknown event window 'reactoin'/
            );
        });
    });

    describe('checkEmit()', function () {
        it('accepts an event raised with its catalogued parameters', function () {
            const event = new Event('onCardStood', { card: {} });

            expect(() => this.validator.checkEmit('onCardStood:reaction', event)).not.toThrow();
        });

        it('accepts optional parameters being present or missing', function () {
            const base = { card: {}, location: 'hand', player: {} };

            expect(() =>
                this.validator.checkEmit('onCardPlaced', new Event('onCardPlaced', base))
            ).not.toThrow();
            expect(() =>
                this.validator.checkEmit(
                    'onCardPlaced',
                    new Event('onCardPlaced', { ...base, bottom: true })
                )
            ).not.toThrow();
        });

        it('rejects an event that is missing a parameter', function () {
            const event = new Event('onCardKneeled', { card: {}, source: {} });

            expect(() => this.validator.checkEmit('onCardKneeled', event)).toThrow(
                /'onCardKneeled' has the wrong parameters \(missing reason\)/
            );
        });

        it('rejects an event with an unexpected parameter', function () {
            const event = new Event('onCardStood', { card: {}, cards: [] });

            expect(() => this.validator.checkEmit('onCardStood', event)).toThrow(
                /unexpected cards/
            );
        });

        it('does not check the parameters of aggregate events', function () {
            const event = new Event('onCardDiscarded:aggregate', { aggregate: {}, events: [] });

            expect(() =>
                this.validator.checkEmit('onCardDiscarded:aggregate:reaction', event)
            ).not.toThrow();
        });
    });

    describe('in a game', function () {
        it('checks listeners and emitted events outside production', function () {
            const game = new Game({ owner: {} }, { router: {} });

            expect(() => game.on('onCardKnelt', () => true)).toThrow(/Unknown event/);
            expect(() => game.emit('onCardKnelt')).toThrow(/Unknown event/);
        });

        it('can be turned off', function () {
            const game = new Game({ owner: {} }, { router: {}, validateEvents: false });

            expect(() => game.on('onCardKnelt', () => true)).not.toThrow();
        });
    });

    describe('every card', function () {
        beforeEach(function () {
            this.listened = [];
            this.gameSpy = {
                on: (name) => this.listened.push(name),
                removeListener: vi.fn(),
                addPower: vi.fn(),
                addMessage: vi.fn(),
                addEffect: vi.fn()
            };
            this.playerSpy = { registerAbilityMax: vi.fn(), game: this.gameSpy };
        });

        it('only listens for catalogued events', function () {
            const unknown = [];

            for (const cardClass of Object.values(cards)) {
                this.listened = [];
                const card = new cardClass(this.playerSpy, {});
                for (const name of [...registeredEventNames(card), ...this.listened]) {
                    try {
                        checkEventName(name);
                    } catch {
                        unknown.push(`${cardClass.name}: ${name}`);
                    }
                }
            }

            expect(unknown).toEqual([]);
        });
    });
});
