describe('Daenerys Targaryen (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Daenerys Targaryen (Core)']
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it("gives each character on an opponent's side in a challenge against you -1 STR while she is standing", function () {
        expect(this.tumblestoneKnight.getStrength()).toBe(1);

        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player2).isReadyToTakeAction();
    });
});
