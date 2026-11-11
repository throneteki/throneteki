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
    }

    it('is refused to a player who does not stop at the window', function () {
        setup(this);
        expect(this.player2).toHavePromptButton('Military');
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBe('window');
        this.player1.clickCard(this.isleOfRavens);
        expect(this.player1).not.toAllowSelect(this.winterfellSteward);
        expect(this.isleOfRavens.kneeled).toBe(false);
    });

    it('is offered before the active player chooses a challenge', function () {
        setup(this, { stops: ['player1'] });
        expect(this.player1).toHavePrompt('Initiate an action');
        expect(this.player1.actionUnavailableReason(this.isleOfRavens)).toBeUndefined();
        expect(this.player2).not.toHavePromptButton('Military');
    });

    it('lets the active player choose a challenge once every other player passes', function () {
        setup(this, { stops: ['player1'] });
        this.player1.clickPrompt('Pass');
        expect(this.player2).toHavePromptButton('Military');
        this.player2.clickPrompt('Military');
        expect(this.player2).toHavePrompt('Select challenge attackers');
    });

    it('lets the active player choose a challenge after an action', function () {
        setup(this, { stops: ['player1'] });
        this.player1.clickCard(this.isleOfRavens);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.location).toBe('draw deck');
        expect(this.player1).toHavePrompt('Initiate an action');
        this.player1.clickPrompt('Pass');
        expect(this.player2).toHavePromptButton('Military');
    });

    it('is offered again when the active player takes an action while choosing', function () {
        this.setupTest({
            phase: 'challenge',
            gameOptions: { manualMode: false },
            player1: {
                inPlay: ['Isle of Ravens', 'Hedge Knight'],
                discard: ['Winterfell Steward']
            },
            player2: { actionWindows: { challengeBegin: true } }
        });
        this.player2.clickPrompt('Pass');
        this.player1.clickCard(this.isleOfRavens);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.player2).toHavePrompt('Initiate an action');
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Military');
        expect(this.player1).toHavePrompt('Select challenge attackers');
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
