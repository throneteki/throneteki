describe('Free Brothers (ATT)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Free Brothers (ATT)'],
                drawDeck: ['Jalabhar Xho', 'Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.freeBrothers);
        this.player1.triggerAbility(this.freeBrothers);
    });

    it('searches your deck for an Ally with printed cost 3 or lower and places it in your discard pile after it enters play', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.jalabharXho);

        expect(this.jalabharXho.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
