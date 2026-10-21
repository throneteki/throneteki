describe('Shipborn Bastard', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Shipborn Bastard', 'Salty Navigator']
            }
        });
    });

    it('has STR equal to the number of cards you control with initiative modifiers, and gives +1 initiative', function () {
        expect(this.shipbornBastard.getStrength()).toBe(2);
        expect(this.player1Object.getInitiative()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
