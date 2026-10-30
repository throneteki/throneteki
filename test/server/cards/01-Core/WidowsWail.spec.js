describe("Widow's Wail", function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [
                    { card: 'Joffrey Baratheon (Core)', attachments: ["Widow's Wail"] },
                    'Tumblestone Knight'
                ]
            }
        });
    });

    it('gives the attached character +2 STR, and a [military] icon if it is Joffrey Baratheon', function () {
        expect(this.joffreyBaratheon.getStrength()).toBe(5);
        expect(this.joffreyBaratheon.hasIcon('military')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
