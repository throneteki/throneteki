describe('Clever Feint (MoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Clever Feint (MoD)'],
                inPlay: ['Undercity Spymaster', 'Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.cleverFeint);
    });

    it('kneels your faction card to return any number of cards you control with shadow to shadows', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.undercitySpymaster);
        this.player1.clickPrompt('Done');

        expect(this.undercitySpymaster.location).toBe('shadows');
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
