import BaseAbility from '../../server/game/baseability.js';
import CardSelector from '../../server/game/CardSelector.js';

describe('BaseAbility with a target and a game action', function () {
    beforeEach(function () {
        this.standing = {
            name: 'standing',
            getType: () => 'character',
            allowGameAction: () => true
        };
        this.kneeling = {
            name: 'kneeling',
            getType: () => 'character',
            allowGameAction: () => true
        };
        this.context = { targets: {} };
        this.seen = [];
        this.gameAction = {
            allow: (context) => {
                this.seen.push(context.target);
                const cards = Array.isArray(context.target) ? context.target : [context.target];
                return cards.every((card) => card !== this.kneeling);
            }
        };
    });

    it('can be created', function () {
        expect(
            () =>
                new BaseAbility({
                    target: { cardCondition: () => true },
                    gameAction: this.gameAction
                })
        ).not.toThrow();
    });

    it('rules out single targets the game action could not change', function () {
        const ability = new BaseAbility({
            target: { cardCondition: () => true },
            gameAction: this.gameAction
        });
        const selector = CardSelector.for({
            ...ability.targets[0].properties,
            context: this.context
        });

        expect(selector.canTarget(this.standing, this.context)).toBe(true);
        expect(selector.canTarget(this.kneeling, this.context)).toBe(false);
        expect(this.seen).toEqual([this.standing, this.kneeling]);
    });

    it('checks each card of a multi-card target as an array', function () {
        const ability = new BaseAbility({
            target: { mode: 'unlimited', cardCondition: () => true },
            gameAction: this.gameAction
        });
        const selector = CardSelector.for({
            ...ability.targets[0].properties,
            context: this.context
        });

        expect(selector.canTarget(this.standing, this.context)).toBe(true);
        expect(selector.canTarget(this.kneeling, this.context)).toBe(false);
        expect(this.seen).toEqual([[this.standing], [this.kneeling]]);
    });

    it('does not change the context while checking candidates', function () {
        const ability = new BaseAbility({
            target: { cardCondition: () => true },
            gameAction: this.gameAction
        });
        const selector = CardSelector.for({
            ...ability.targets[0].properties,
            context: this.context
        });

        selector.canTarget(this.standing, this.context);

        expect(this.context.target).toBeUndefined();
        expect(this.context.targets.target).toBeUndefined();
    });

    describe('with several targets that have their own game actions', function () {
        beforeEach(function () {
            this.forTarget = (name) => ({
                allow: (context) => context.targets[name] !== this.kneeling,
                createEvent: vi.fn()
            });
            this.ability = new BaseAbility({
                targets: {
                    first: { cardCondition: () => true, gameAction: this.forTarget('first') },
                    second: { cardCondition: () => true, gameAction: 'kill' }
                }
            });
        });

        it("rules out candidates the target's own game action could not change", function () {
            const selector = CardSelector.for({
                ...this.ability.targets[0].properties,
                context: this.context
            });

            expect(selector.canTarget(this.standing, this.context)).toBe(true);
            expect(selector.canTarget(this.kneeling, this.context)).toBe(false);
        });

        it('leaves targets that only name an action for immunity alone', function () {
            const selector = CardSelector.for({
                ...this.ability.targets[1].properties,
                context: this.context
            });

            expect(this.ability.targets[1].properties.gameAction).toBe('kill');
            expect(selector.canTarget(this.kneeling, this.context)).toBe(true);
        });

        it("resolves the targets' game actions together", function () {
            expect(this.ability.gameAction.resolveActions(this.context)).toEqual([
                this.ability.targetGameActions[0]
            ]);
            expect(this.ability.isGameActionAllowed(this.context)).toBe(true);
        });

        it('cannot also have a handler or game action', function () {
            const targets = {
                first: { cardCondition: () => true, gameAction: this.forTarget('first') }
            };

            expect(() => new BaseAbility({ targets, handler: () => true })).toThrow();
            expect(() => new BaseAbility({ targets, gameAction: this.gameAction })).toThrow();
        });
    });

    describe("with a target's own game action", function () {
        const resolvedPerSelection = (choosingPlayer) => {
            const ability = new BaseAbility({
                target: {
                    choosingPlayer,
                    cardCondition: () => true,
                    gameAction: { allow: () => true }
                }
            });
            return ability.targetGameActions[0].name === 'forEachSelection';
        };

        it('resolves it once per selection when more than one player can choose', function () {
            expect(resolvedPerSelection('each')).toBe(true);
            expect(resolvedPerSelection('eachOpponent')).toBe(true);
            expect(resolvedPerSelection((player) => !!player)).toBe(true);
        });

        it('resolves it directly when a single player chooses', function () {
            expect(resolvedPerSelection(undefined)).toBe(false);
            expect(resolvedPerSelection('opponent')).toBe(false);
        });
    });

    describe('with a chosen opponent', function () {
        beforeEach(function () {
            this.player = { name: 'player' };
            this.canDiscard = { name: 'canDiscard' };
            this.emptyHand = { name: 'emptyHand' };
            this.context = {
                player: this.player,
                targets: {},
                game: { getPlayers: () => [this.player, this.canDiscard, this.emptyHand] }
            };
        });

        it('only offers opponents the game action could affect', function () {
            const ability = new BaseAbility({
                chooseOpponent: true,
                gameAction: { allow: (context) => context.opponent === this.canDiscard }
            });

            expect(ability.choosePlayerDefinition.eligibleChoices(this.context)).toEqual([
                this.canDiscard
            ]);
            expect(this.context.opponent).toBeUndefined();
        });

        it('does not filter players when the action also depends on a card target', function () {
            const ability = new BaseAbility({
                chooseOpponent: true,
                target: { cardCondition: () => true },
                gameAction: { allow: (context) => context.opponent === this.canDiscard }
            });

            expect(ability.choosePlayerDefinition.eligibleChoices(this.context)).toEqual([
                this.canDiscard,
                this.emptyHand
            ]);
        });
    });

    it('leaves the game state check to the target when the action depends on it', function () {
        const ability = new BaseAbility({
            target: { cardCondition: () => true },
            gameAction: { allow: () => false }
        });

        expect(ability.isGameActionAllowed(this.context)).toBe(true);
    });
});
