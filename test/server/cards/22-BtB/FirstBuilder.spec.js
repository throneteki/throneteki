describe('First Builder', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Joffrey Baratheon (Core)', attachments: ['First Builder'] }],
                drawDeck: ['Heart Tree Grove', 'The Kingsroad']
            }
        });
    });

    it('gives the attached character a [power] icon and the Builder trait, and searches for a cheap attachment or location after you win a [power] challenge with a Builder', function () {
        expect(this.joffreyBaratheon.hasTrait('Builder')).toBe(true);

        this.unopposedChallenge(this.player1, 'Power', this.joffreyBaratheon);
        this.player1.triggerAbility(this.firstBuilder);
        this.player1.clickCard(this.theKingsroad);

        expect(this.theKingsroad.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
