describe('Rhaegal (MoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'targaryen',
                inPlay: [{ card: 'Rhaegal (MoD)', kneeling: true }, 'Ser Ilyn Payne']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickCard(this.serIlynPayne);
        this.player1.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.rhaegal);
    });

    it("stands after an opponent's character is killed by a card effect", function () {
        expect(this.rhaegal.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
