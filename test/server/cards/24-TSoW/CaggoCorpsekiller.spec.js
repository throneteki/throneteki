describe('Caggo Corpsekiller', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Caggo Corpsekiller', { card: 'Hedge Knight', attachments: ['Patience'] }]
            }
        });
        this.player1.clickMenu(this.patience, 'Return parent to hand');
        this.player1.triggerAbility('Caggo Corpsekiller');
    });

    it("returns itself to hand to place a character being returned to hand in its owner's dead pile instead", function () {
        expect(this.caggoCorpsekiller.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('dead pile');
    });
});
