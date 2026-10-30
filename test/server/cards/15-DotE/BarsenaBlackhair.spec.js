describe('Barsena Blackhair', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Barsena Blackhair', attachments: ["Widow's Wail"] }]
            }
        });
    });

    it('gets +3 STR while a Weapon attachment is attached to her', function () {
        expect(this.barsenaBlackhair.getStrength()).toBe(7);
        expect(this.player1).isReadyToTakeAction();
    });
});
