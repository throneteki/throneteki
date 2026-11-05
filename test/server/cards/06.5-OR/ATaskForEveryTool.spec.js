describe('A Task For Every Tool', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['A Task For Every Tool', 'Burned Men'],
                inPlay: ['Tumblestone Knight'],
                gold: 1
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.aTaskForEveryTool);
        this.player1.clickCard(this.burnedMen);
    });

    it('puts a lannister character with printed STR 2 or lower into play from your hand', function () {
        expect(this.burnedMen.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
