describe('Ser Eldon Estermont', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    'Ser Eldon Estermont',
                    { card: 'Dragonstone Port', kneeling: true },
                    { card: 'Sweet Cersei', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.serEldonEstermont);
    });

    it('stands a baratheon location', function () {
        expect(this.player1).not.toBeAbleToSelect(this.sweetCersei);

        this.player1.clickCard(this.dragonstonePort);

        expect(this.dragonstonePort.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
