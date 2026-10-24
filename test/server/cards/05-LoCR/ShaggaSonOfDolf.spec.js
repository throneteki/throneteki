describe('Shagga Son of Dolf', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', inPlay: ['Burned Men'], hand: ['Shagga Son of Dolf'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.burnedMen);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.shaggaSonOfDolf);
        this.player1.clickCard(this.burnedMen);
    });

    it('ambushes for free while you control a Clansman, then kills a lannister character you control', function () {
        expect(this.shaggaSonOfDolf.location).toBe('play area');
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
