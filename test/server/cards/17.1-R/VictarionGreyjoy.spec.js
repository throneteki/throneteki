describe('Victarion Greyjoy (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Victarion Greyjoy (R)', kneeling: true }, 'Great Kraken']
            },
            player2: { inPlay: ['The Roseroad'] }
        });
    });

    it('kneels a Warship location to stand itself', function () {
        this.player1.clickMenu(this.victarionGreyjoy, 'Stand Victarion');
        this.player1.clickCard(this.greatKraken);
        expect(this.greatKraken.kneeled).toBe(true);
        expect(this.victarionGreyjoy.kneeled).toBe(false);
    });

    describe('kneeling a Warship location to kneel a location or gain renown', function () {
        beforeEach(function () {
            this.player1.clickMenu(this.victarionGreyjoy, 'Kneel location or gain renown');
            this.player1.clickCard(this.greatKraken);
        });

        it('can kneel a location', function () {
            this.player1.clickPrompt('Kneel a location');
            this.player1.clickCard(this.theRoseroad);
            expect(this.theRoseroad.kneeled).toBe(true);
        });

        it('can gain renown until the end of the challenge', function () {
            this.player1.clickPrompt('Gain renown');
            expect(this.victarionGreyjoy.hasKeyword('renown')).toBe(true);
        });
    });
});
