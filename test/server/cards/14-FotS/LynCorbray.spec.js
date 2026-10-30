describe('Lyn Corbray (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Lyn Corbray (FotS)', kneeling: true }] },
            player2: { inPlay: ['Cersei Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.cerseiLannister);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility(this.lynCorbray);
    });

    it('stands after an opponent initiates a power challenge against you', function () {
        expect(this.lynCorbray.kneeled).toBe(false);

        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });
});
