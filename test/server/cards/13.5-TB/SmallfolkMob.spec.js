describe('Smallfolk Mob', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight', 'Bran Stark (Core)'],
                shadows: ['Smallfolk Mob'],
                gold: 0
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.smallfolkMob);
        this.player1.clickCard(this.branStark);
    });

    it('sacrifices a unique stark character to put itself into play from shadows', function () {
        expect(this.branStark.location).toBe('discard pile');
        expect(this.smallfolkMob.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
