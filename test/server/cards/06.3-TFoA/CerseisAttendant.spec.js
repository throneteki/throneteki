describe("Cersei's Attendant", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ["Cersei's Attendant"]
            }
        });

        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.cerseisAttendant);
        this.player1.clickPrompt('Done');
    });

    it('gains insight while participating in a challenge against an opponent with no cards in hand', function () {
        expect(this.cerseisAttendant.hasKeyword('Insight')).toBe(true);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
