describe('The Boy King', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                inPlay: [{ card: 'Ser Jaime Lannister (Core)', attachments: ['The Boy King'] }]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.serJaimeLannister);
        this.player2.clickCard(this.burnedMen);
        this.player1.triggerAbility(this.theBoyKing);
    });

    it('gives the attached character the King trait, and kneels to give it 1 power after a character with printed cost 3 or lower is killed', function () {
        expect(this.serJaimeLannister.hasTrait('King')).toBe(true);
        expect(this.theBoyKing.kneeled).toBe(true);
        expect(this.serJaimeLannister.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
