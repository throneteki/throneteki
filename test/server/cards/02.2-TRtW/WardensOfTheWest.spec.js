describe('Wardens of the West', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { plot: 'Wardens of the West', inPlay: ['Cersei Lannister (Core)'], gold: 2 },
            player2: { hand: ['Tumblestone Knight', 'Burned Men', 'Khal Drogo (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        this.player1.triggerAbility(this.wardensOfTheWest);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
    });

    it('pays 2 gold to have the losing opponent choose and discard 2 cards from their hand after you win an intrigue challenge', function () {
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
