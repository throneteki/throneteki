describe('Jhiqui', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Jhiqui', 'Margaery Tyrell (Core)'],
                hand: ['Burned Men']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.margaeryTyrell);
        this.player1.triggerAbility(this.jhiqui);
        this.player1.clickCard(this.burnedMen);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it('discards a card from your hand to give a participating Lord or Lady 1 power after you win a challenge', function () {
        expect(this.burnedMen.location).toBe('discard pile');
        expect(this.margaeryTyrell.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
