import Effects from '../../../server/game/effects.js';

describe('settling effects', function () {
    function addEffects(context, effects) {
        context.game.addSimultaneousEffects(
            effects.map(({ condition, effect }) => ({
                source: context.tumblestoneKnight,
                properties: {
                    duration: 'persistent',
                    location: 'any',
                    match: context.tumblestoneKnight,
                    condition,
                    effect
                }
            }))
        );
        context.game.continue();
    }

    function refresh(context) {
        context.game.refreshGameState();
        context.game.continue();
    }

    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tumblestone Knight'] }
        });
    });

    it('applies an effect enabled by another effect in the same recalculation', function () {
        let enabled = false;
        addEffects(this, [
            {
                condition: () => this.tumblestoneKnight.hasIcon('intrigue'),
                effect: Effects.modifyStrength(3)
            },
            { condition: () => enabled, effect: Effects.addIcon('intrigue') }
        ]);
        expect(this.tumblestoneKnight.getStrength()).toBe(2);

        enabled = true;
        refresh(this);

        expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('stops and reports effects that keep switching each other', function () {
        addEffects(this, [
            {
                condition: () => !this.tumblestoneKnight.hasIcon('intrigue'),
                effect: Effects.addIcon('intrigue')
            }
        ]);
        refresh(this);
        refresh(this);

        const alert =
            'The effects of Tumblestone Knight keep switching each other on and off, so they are left as they are';
        expect(this.game.getPlainTextLog().split(alert)).toHaveLength(2);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
