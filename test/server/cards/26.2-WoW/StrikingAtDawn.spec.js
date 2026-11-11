describe('Striking at Dawn (WoW)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'House Maester', attachments: ['Knighted'] }]
            },
            player2: { plot: 'Striking at Dawn (WoW)' }
        });
    });

    it("stops each character's STR being increased or reduced by card effects", function () {
        expect(this.houseMaester.getStrength()).toBe(2);
        expect(this.houseMaester.hasTrait('Knight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
