describe("The King's Justice", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Cersei Lannister (Core)',
                    { card: 'Ser Jaime Lannister (Core)', attachments: ["The King's Justice"] }
                ]
            },
            player2: { inPlay: [{ card: 'Tumblestone Knight', kneeling: true }] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.cerseiLannister);
        this.player1.triggerAbility(this.theKingsJustice);
    });

    it('kneels the attached character to kill a kneeling character the losing opponent controls after you win a power challenge', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.serJaimeLannister.kneeled).toBe(true);
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
