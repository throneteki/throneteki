describe('actions while a reaction window is open', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Chamber of the Painted Table', 'Robb Stark (Core)'],
                hand: ['Lay Waste'],
                gold: 3
            },
            player2: { power: 2, inPlay: ['The Roseroad'] }
        });
        this.completeChallengesPhase();
    });

    it('cannot be taken, and are not shown as playable', function () {
        expect(this.player1).toAllowAbilityTrigger('Chamber of the Painted Table');
        expect(this.layWaste.getCanPlayState(this.player1.player)).toBeUndefined();

        this.player1.clickCard(this.layWaste);

        expect(this.layWaste.location).toBe('hand');
        expect(this.theRoseroad.location).toBe('play area');
        expect(this.player1).toAllowAbilityTrigger('Chamber of the Painted Table');
    });
});
