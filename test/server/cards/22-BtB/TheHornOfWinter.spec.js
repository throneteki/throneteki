describe('The Horn of Winter', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Robb Stark (Core)', attachments: ['The Horn of Winter'] }]
            },
            player2: { inPlay: ['The Roseroad'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.theRoseroad);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('The Horn of Winter');
        this.player1.clickCard(this.theRoseroad);
    });

    it('sacrifices itself after you win to treat a location targeted by assault as blank until the end of the round', function () {
        expect(this.theHornOfWinter.location).toBe('discard pile');
        expect(this.theRoseroad.isAnyBlank()).toBe(true);
    });
});
