describe('Nymeria of Ny Sar', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                inPlay: [
                    { card: 'Sunspear (Core)', attachments: ['Nymeria of Ny Sar'] },
                    'Robb Stark (Core)'
                ],
                plotDeck: ['Sailing the Summer Sea', 'A Noble Cause']
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.robbStark);
        this.player1.triggerAbility('Nymeria of Ny Sar');
    });

    it('kneels to reveal a Martell or Summer plot after you win a challenge by 5 or more STR', function () {
        expect(this.player1).toBeAbleToSelect(this.sailingTheSummerSea);
        expect(this.player1).not.toBeAbleToSelect(this.aNobleCause);
        this.player1.clickCard(this.sailingTheSummerSea);
        expect(this.nymeriaOfNySar.kneeled).toBe(true);
        expect(this.player1Object.activePlot).toBe(this.sailingTheSummerSea);
    });
});
