describe('Dark Wings, Dark Words', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Dark Wings, Dark Words',
                hand: ['Nightmares']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });

        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.houseMaester);
        this.player1.triggerAbility(this.darkWingsDarkWords);
    });

    it('draws 1 card after you play an event', function () {
        expect(this.player1Object.hand).toHaveLength(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
