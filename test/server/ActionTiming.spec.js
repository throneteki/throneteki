describe('taking an action before a challenge', function () {
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
        expect(context.player2).toHavePromptButton('Military');
    }

    it('is refused to a player who does not stop at the window', function () {
        setup(this);
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBe('window');
        this.player1.clickCard(this.isleOfRavens);
        expect(this.player1).not.toAllowSelect(this.winterfellSteward);
        expect(this.isleOfRavens.kneeled).toBe(false);
    });

    it('waits for the active player, who is first player, to choose a challenge', function () {
        setup(this, { stops: ['player1'] });
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBe('window');
    });

    it('is offered once the active player has chosen a challenge', function () {
        setup(this, { stops: ['player1'] });
        this.player2.clickPrompt('Military');
        expect(this.player1).toHavePrompt('Initiate an action');
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBeUndefined();
    });

    it('returns the active player to choosing a challenge after an action', function () {
        setup(this, { stops: ['player1'] });
        this.player2.clickPrompt('Military');
        this.player1.clickCard(this.isleOfRavens);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.location).toBe('draw deck');
        expect(this.game.currentChallenge).toBeFalsy();
        expect(this.player2).toHavePromptButton('Military');
    });

    it('starts the chosen challenge once every other player passes', function () {
        setup(this, { stops: ['player1'] });
        this.player2.clickPrompt('Military');
        this.player1.clickPrompt('Pass');
        expect(this.player2).toHavePrompt('Select challenge attackers');
    });

    it('lets the active player act on their own turn without stopping at the window', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Isle of Ravens'], discard: ['Winterfell Steward'] }
        });
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBeUndefined();
        this.player1.clickCard(this.isleOfRavens);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.location).toBe('draw deck');
        expect(this.player1).toHavePromptButton('Done');
    });
});
