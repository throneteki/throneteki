describe('King of Salt and Rock', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [{ card: "Black Wind's Crew", attachments: ['King of Salt and Rock'] }]
            },
            player2: { drawDeck: ['Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.blackWindsCrew);
        this.player1.triggerAbility(this.kingOfSaltAndRock);
    });

    it('gives the attached character the King trait and pillage, and 1 power after pillage discards an attachment or location', function () {
        expect(this.blackWindsCrew.hasTrait('King')).toBe(true);
        expect(this.blackWindsCrew.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
