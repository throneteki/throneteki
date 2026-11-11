describe('Clever Feint (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Clever Feint (R2)'],
                inPlay: ['Undercity Spymaster', 'Tumblestone Knight'],
                gold: 3
            }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.cleverFeint);
    });

    it('kneels your faction card and pays X gold to return X cards you control with shadow to shadows', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.undercitySpymaster);
        this.player1.clickPrompt('Done');

        expect(this.undercitySpymaster.location).toBe('shadows');
        expect(this.player1Object.gold).toBe(this.startingGold - 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
