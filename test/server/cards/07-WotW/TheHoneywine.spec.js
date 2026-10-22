describe('The Honeywine', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'tyrell', inPlay: ['The Honeywine', 'Ser Jaime Lannister (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.theHoneywine);
    });

    it('gains 1 power after you win a challenge by 5 or more STR as the attacker', function () {
        expect(this.theHoneywine.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
