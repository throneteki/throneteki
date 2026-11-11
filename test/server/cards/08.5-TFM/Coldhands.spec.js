describe('Coldhands', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                hand: ['Coldhands'],
                inPlay: ['Tumblestone Knight'],
                gold: 5
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickCard(this.coldhands);
        this.player1.triggerAbility(this.coldhands);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
    });

    it('removes another non-Army character controlled by each player from the game until he leaves play after you marshal him', function () {
        expect(this.tumblestoneKnight.location).toBe('out of game');
        expect(this.burnedMen.location).toBe('out of game');
        expect(this.player1).isReadyToTakeAction();
    });
});
