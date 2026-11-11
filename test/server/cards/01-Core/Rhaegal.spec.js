describe('Rhaegal (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: ['Rhaegal (Core)', 'Daenerys Targaryen (Core)']
            }
        });
        this.unopposedChallenge(this.player1, 'Power', this.daenerysTargaryen);
        this.player1.triggerAbility(this.rhaegal);
        this.player1.clickCard(this.daenerysTargaryen);
    });

    it('stands a Stormborn character after you win a challenge a Stormborn character you control is participating in', function () {
        expect(this.daenerysTargaryen.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
