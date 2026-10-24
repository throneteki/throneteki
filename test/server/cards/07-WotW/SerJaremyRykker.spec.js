describe('Ser Jaremy Rykker', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Ser Jaremy Rykker', 'Ranging Party']
            }
        });
    });

    it('gives each other Ranger character you control a [power] icon', function () {
        expect(this.rangingParty.hasIcon('power')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
