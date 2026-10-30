describe('Cunning Steward', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Cunning Steward']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('gains a [military] and a [power] icon while you are the defending player', function () {
        expect(this.cunningSteward.hasIcon('military')).toBe(true);
        expect(this.cunningSteward.hasIcon('power')).toBe(true);

        this.player2.clickCard(this.cunningSteward);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
