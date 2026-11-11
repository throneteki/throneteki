describe('Dornish Revenge', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Robert Baratheon (Core)', 'Ranging Party'],
                hand: ['Dornish Revenge'],
                gold: 5
            },
            player2: { inPlay: ['Hedge Knight', 'Winterfell Steward'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.robertBaratheon);
        this.player1.clickCard(this.rangingParty);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Dornish Revenge');
        this.player1.clickCard(this.winterfellSteward);
        this.skipActionWindow();
    });

    it('forces a character to be declared as a defender, and has the loser kill a defender if you win by 5', function () {
        this.player2.clickPrompt('Done');
        expect(this.winterfellSteward.isDefending()).toBe(true);
        this.skipActionWindow();
        this.player2.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.location).toBe('dead pile');
    });
});
