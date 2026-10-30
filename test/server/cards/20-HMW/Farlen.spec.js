describe('Farlen (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Summer (Core)'],
                hand: ['Farlen (HMW)'],
                drawDeck: ['The Wolfswood (Core)']
            }
        });

        this.player1.clickCard(this.farlen);
        this.player1.triggerAbility(this.farlen);
    });

    it('gives each unique Direwolf renown, and puts The Wolfswood into play after you marshal him', function () {
        this.player1.clickCard(this.theWolfswood);

        expect(this.theWolfswood.location).toBe('play area');
        expect(this.summer.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
