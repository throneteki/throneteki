describe('Theon Greyjoy (TFoA)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Theon Greyjoy (TFoA)']
            },
            player2: {
                inPlay: ['Khal Drogo (Core)']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.theonGreyjoy);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
    });

    it('stops each character with higher STR contributing while he attacks alone', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(0);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
