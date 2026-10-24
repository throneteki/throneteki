describe('Scorpion Knight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Scorpion Knight', 'Ser Willam Wells (TIC)', 'Tumblestone Knight']
            },
            player2: { inPlay: ["Euron Crow's Eye (Core)"] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.serWillamWells);
        this.player1.clickCard(this.euronCrowsEye);
        this.player1.triggerAbility(this.scorpionKnight);
        this.player1.triggerAbility(this.scorpionKnight);
        this.player1.triggerAbility(this.scorpionKnight);
    });

    it('gets +1 STR after a character loses a challenge icon', function () {
        expect(this.scorpionKnight.getStrength()).toBe(5);
        expect(this.player2).isReadyToTakeAction();
    });
});
