describe('Raiding the Bay of Ice', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Raiding the Bay of Ice'],
                inPlay: ['Ser Jaime Lannister (Core)', 'Sweet Cersei']
            },
            player2: { inPlay: ['Casterly Rock (Core)'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player1.triggerAbility(this.raidingTheBayOfIce);
    });

    it("kneels a Warship to place a non-limited location the losing opponent controls on top of its owner's deck after you win as the attacker", function () {
        this.player1.clickCard(this.sweetCersei);
        this.player1.clickCard(this.casterlyRock);

        expect(this.sweetCersei.kneeled).toBe(true);
        expect(this.casterlyRock.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});
