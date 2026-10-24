describe('Great Kraken', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Great Kraken', 'Balon Greyjoy (Core)']
            }
        });
    });

    it('gives Balon Greyjoy stealth', function () {
        expect(this.balonGreyjoy.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('draws 1 card or gains 1 power after you win an unopposed challenge', function () {
        this.unopposedChallenge(this.player1, 'Power', this.balonGreyjoy);
        this.player1.triggerAbility(this.greatKraken);
        this.player1.clickPrompt('Gain 1 power');

        expect(this.player1Object.faction.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
