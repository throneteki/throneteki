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

    it('leaves the game state check to the target when the action depends on it', function () {
        const ability = new BaseAbility({
            target: { cardCondition: () => true },
            gameAction: { allow: () => false }
        });

        expect(ability.isGameActionAllowed(this.context)).toBe(true);
    });
});
