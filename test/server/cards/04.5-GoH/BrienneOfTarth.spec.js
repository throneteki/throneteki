describe('Brienne of Tarth (GoH)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Brienne of Tarth (GoH)', 'Robb Stark (AtSK)']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.brienneOfTarth);
        this.player2.clickPrompt('Done');
    });

    it('does not kneel when declared as a defender while you control a King character', function () {
        expect(this.brienneOfTarth.kneeled).toBe(false);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
