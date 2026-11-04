describe('taking an action after passing in the last action window', function () {
    function setup(context, { stops = [] } = {}) {
        context.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            gameOptions: { manualMode: false },
            player1: { inPlay: ['Isle of Ravens'] },
            player2: { inPlay: ['Hedge Knight'], discard: ['Winterfell Steward'] }
        });
        for (const player of stops) {
            context[player].togglePromptedActionWindow('challengeBegin', true);
        }
        context.player2.clickPrompt('Done');
        context.player1.clickPrompt('Done');
        for (const player of ['player2', 'player1']) {
            if (stops.includes(player)) {
                context[player].clickPrompt('Pass');
            }
        }
        expect(context.player2).toHavePromptButton('Military');
    }

    it('is refused to a player who passed, while the opponent chooses a challenge', function () {
        setup(this, { stops: ['player1', 'player2'] });
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBe('window');
        this.player1.clickCard(this.isleOfRavens);
        expect(this.player1).not.toAllowSelect(this.winterfellSteward);
        expect(this.isleOfRavens.kneeled).toBe(false);
        expect(this.player2).toHavePromptButton('Military');
    });

    it('is allowed again once the next action window is reached', function () {
        setup(this, { stops: ['player1', 'player2'] });
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Pass');
        expect(this.player1).toHavePrompt('Initiate an action');
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBeUndefined();
    });

    it('is allowed while the opponent chooses a challenge when the window was skipped', function () {
        setup(this);
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBeUndefined();
        this.player1.clickCard(this.isleOfRavens);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.location).toBe('draw deck');
    });
});
