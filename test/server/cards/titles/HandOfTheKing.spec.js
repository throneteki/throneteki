describe('Hand of the King', function () {
    beforeEach(function () {
        this.setupTest({
            gameFormat: 'melee',
            phase: 'plot',
            player1: { inPlay: ['Bastard in Hiding', 'Shireen Baratheon (Core)', 'House Maester'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        for (const player of [this.player1, this.player2, this.player3])
            player.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.selectTitle('Hand of the King');
        this.player2.selectTitle('Master of Coin');
        this.player3.selectTitle('Master of Ships');
        this.completeMarshalPhase();
    });

    it('grants one extra power challenge against a different opponent and adds one challenge strength', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickPrompt('player2');
        expect(this.game.currentChallenge.attackerStrength).toBe(0);
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.attackerStrength).toBe(3);
        expect(this.bastardInHiding.getStrength()).toBe(2);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Power');
        expect(this.player1).toHaveDisabledPromptButton('player2');
        expect(this.player1).toHavePromptButton('player3');
        this.player1.clickPrompt('player3');
        this.player1.clickCard(this.shireenBaratheon);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player3.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player1).toHaveDisabledPromptButton('Power');
        expect(this.houseMaester.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('contributes power strength when defending', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickPrompt('player1');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.attackerStrength).toBe(2);
        expect(this.game.currentChallenge.defenderStrength).toBe(3);
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not contribute strength in a military challenge', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickPrompt('player2');
        this.player1.clickCard(this.bastardInHiding);
        this.player1.clickPrompt('Done');
        expect(this.game.currentChallenge.attackerStrength).toBe(2);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
