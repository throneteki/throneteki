describe('A Lannister Always Pays His Debts', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Tumblestone Knight', 'Hedge Knight'],
                hand: ['A Lannister Always Pays His Debts']
            },
            player2: { inPlay: ['Bastard in Hiding'] }
        });
        this.unopposedChallenge(this.player2, 'Power', this.bastardInHiding);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.aLannisterAlwaysPaysHisDebts);
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player2.clickCard(this.bastardInHiding);
    });

    it('lets you initiate an additional military challenge against the opponent who beat you', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');

        expect(this.game.currentChallenge.challengeType).toBe('military');
        expect(this.game.currentChallenge.number).toBe(2);
        expect(this.player2).isReadyToTakeAction();
    });
});
