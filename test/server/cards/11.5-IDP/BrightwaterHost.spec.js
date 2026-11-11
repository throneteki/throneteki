describe('Brightwater Host', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Brightwater Host', 'Margaery Tyrell (HoT)'] },
            player2: { shadows: ['Nighttime Marauders (R)'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.brightwaterHost);
        this.player1.triggerAbility('Brightwater Host');
        this.player1.clickCard(this.nighttimeMarauders);
        this.player1.clickCard(this.margaeryTyrell);
    });

    it("returns a card in shadows to its owner's hand, then a unique tyrell character gains 2 power", function () {
        expect(this.nighttimeMarauders.location).toBe('hand');
        expect(this.margaeryTyrell.power).toBe(2);
    });
});
