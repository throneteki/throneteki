import Effects from '../../../server/game/effects.js';

describe('take control effects', function () {
    function takeControl(context, player, duration) {
        context.game.addSimultaneousEffects([
            {
                source: context.tumblestoneKnight,
                properties: {
                    duration,
                    match: context.tumblestoneKnight,
                    effect: Effects.takeControl(player)
                }
            }
        ]);
        context.game.continue();
    }

    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tumblestone Knight'] }
        });
        this.controlEvents = [];
        this.game.on('onCardTakenControl', (event) =>
            this.controlEvents.push([event.oldController.name, event.player.name])
        );
    });

    it('moves the card and raises one event when control changes', function () {
        takeControl(this, this.player2Object, 'untilEndOfRound');

        expect(this.tumblestoneKnight).toBeControlledBy(this.player2);
        expect(this.player2Object.cardsInPlay).toContain(this.tumblestoneKnight);
        expect(this.player1Object.cardsInPlay).not.toContain(this.tumblestoneKnight);
        expect(this.controlEvents).toEqual([['player1', 'player2']]);
    });

    it('raises no event when an effect that is not in force ends', function () {
        takeControl(this, this.player2Object, 'untilEndOfPhase');
        takeControl(this, this.player1Object, 'untilEndOfRound');
        this.controlEvents = [];

        this.completeMarshalPhase();

        expect(this.tumblestoneKnight).toBeControlledBy(this.player1);
        expect(this.player1Object.cardsInPlay).toContain(this.tumblestoneKnight);
        expect(this.controlEvents).toEqual([]);
    });

    it('returns the card to its owner when the effect ends', function () {
        takeControl(this, this.player2Object, 'untilEndOfPhase');
        this.controlEvents = [];

        this.completeMarshalPhase();

        expect(this.tumblestoneKnight).toBeControlledBy(this.player1);
        expect(this.player1Object.cardsInPlay).toContain(this.tumblestoneKnight);
        expect(this.player2Object.cardsInPlay).not.toContain(this.tumblestoneKnight);
        expect(this.controlEvents).toEqual([['player2', 'player1']]);
    });
});
