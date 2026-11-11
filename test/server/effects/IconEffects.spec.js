import Effects from '../../../server/game/effects.js';

describe('icon effects', function () {
    function addEffects(context, effects, duration = 'untilEndOfPhase') {
        context.game.addSimultaneousEffects(
            effects.map((effect) => ({
                source: context.tumblestoneKnight,
                properties: { duration, match: context.tumblestoneKnight, effect }
            }))
        );
        context.game.continue();
    }

    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tumblestone Knight'] },
            player2: { faction: 'martell', inPlay: ['Scorpion Knight'] }
        });
        this.iconEvents = [];
        for (const name of ['onIconGained', 'onIconLost']) {
            this.game.on(name, (event) => this.iconEvents.push([name, event.icon, event.applying]));
        }
    });

    it('raises one event when an effect makes a card lose an icon', function () {
        addEffects(this, [Effects.removeIcon('military')]);

        expect(this.tumblestoneKnight.hasIcon('military')).toBe(false);
        expect(this.iconEvents).toEqual([['onIconLost', 'military', true]]);
        expect(this.player2).toAllowAbilityTrigger(this.scorpionKnight);
    });

    it('raises an event that is not applying when the loss ends', function () {
        addEffects(this, [Effects.removeIcon('military')]);
        this.player2.clickPrompt('Pass');
        this.iconEvents = [];

        this.completeMarshalPhase();

        expect(this.tumblestoneKnight.hasIcon('military')).toBe(true);
        expect(this.iconEvents).toEqual([['onIconGained', 'military', false]]);
    });

    it('raises no event when a card gains an icon it already has', function () {
        addEffects(this, [Effects.addIcon('military')]);

        expect(this.tumblestoneKnight.hasIcon('military')).toBe(true);
        expect(this.iconEvents).toEqual([]);
    });

    it('raises no event for an icon gained and lost at the same time', function () {
        addEffects(this, [Effects.addIcon('intrigue'), Effects.removeIcon('intrigue')]);

        expect(this.tumblestoneKnight.hasIcon('intrigue')).toBe(false);
        expect(this.iconEvents).toEqual([]);
        expect(this.player1).isReadyToTakeAction();
    });

    it('keeps the printed icons when an icon that could not be gained stops applying', function () {
        addEffects(this, [Effects.cannotGainIcons()], 'persistent');
        addEffects(this, [Effects.addIcon('military')]);
        this.completeMarshalPhase();

        expect(this.tumblestoneKnight.hasIcon('military')).toBe(true);
        expect(this.iconEvents).toEqual([]);
    });
});
