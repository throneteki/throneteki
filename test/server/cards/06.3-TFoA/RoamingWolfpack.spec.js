describe('Roaming Wolfpack', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Roaming Wolfpack']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.roamingWolfpack);
        this.player1.clickPrompt('Done');
    });

    it('gives each attacking Direwolf character +2 STR while it is attacking', function () {
        expect(this.roamingWolfpack.getStrength()).toBe(8);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
