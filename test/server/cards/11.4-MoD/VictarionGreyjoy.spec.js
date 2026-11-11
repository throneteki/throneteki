describe('Victarion Greyjoy (MoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Victarion Greyjoy (MoD)', kneeling: true }, 'Great Kraken']
            },
            player2: { inPlay: ['The Roseroad'] }
        });
        this.player1.clickMenu(this.victarionGreyjoy, 'Kneel a warship location');
        this.player1.clickCard(this.greatKraken);
    });

    it('kneels a Warship location to kneel a location', function () {
        this.player1.clickPrompt('Kneel a location');
        this.player1.clickCard(this.theRoseroad);
        expect(this.greatKraken.kneeled).toBe(true);
        expect(this.theRoseroad.kneeled).toBe(true);
    });

    it('or to stand itself', function () {
        this.player1.clickPrompt('Stand Victarion');
        expect(this.victarionGreyjoy.kneeled).toBe(false);
    });

    it('or to gain renown until the end of the challenge', function () {
        this.player1.clickPrompt('Gain renown');
        expect(this.victarionGreyjoy.hasKeyword('renown')).toBe(true);
    });
});
