describe('The Whispering Sound', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Whispering Sound'],
                shadows: ["King's Landing Dromond (LotW)"],
                gold: 1,
                drawDeck: ['Tumblestone Knight', 'Sweet Cersei']
            }
        });
        this.player1.clickCard(this.kingsLandingDromond);
        this.player1.triggerAbility(this.theWhisperingSound);
    });

    it('kneels to draw 2 cards after a location enters play during the challenges phase, then places a card from your hand on top of your deck', function () {
        this.player1.clickCard(this.sweetCersei);

        expect(this.theWhisperingSound.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.sweetCersei.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
