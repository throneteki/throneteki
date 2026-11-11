describe('Corpse Lake', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Corpse Lake', "Black Wind's Crew"] },
            player2: { drawDeck: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.blackWindsCrew);
        this.player1.triggerAbility(this.corpseLake);
    });

    it("gains 1 power after a character is discarded from an opponent's deck", function () {
        expect(this.corpseLake.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
