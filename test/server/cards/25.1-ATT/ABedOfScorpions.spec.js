describe('A Bed of Scorpions (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['A Bed of Scorpions (ATT)'], inPlay: ['Cersei Lannister (Core)'] },
            player2: { inPlay: ['Grand Maester Pycelle (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.grandMaesterPycelle);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.aBedOfScorpions);
    });

    it('kills a participating character after you win an intrigue challenge', function () {
        this.player1.clickCard(this.grandMaesterPycelle);

        expect(this.grandMaesterPycelle.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
