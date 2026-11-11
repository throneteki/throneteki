describe('Catapult on the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Steward at the Wall', attachments: ['Catapult on the Wall'] }]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.catapultOnTheWall);
        this.player1.clickCard(this.burnedMen);
    });

    it('kneels itself and the attached character to kill an attacking character with STR 4 or lower', function () {
        expect(this.catapultOnTheWall.kneeled).toBe(true);
        expect(this.stewardAtTheWall.kneeled).toBe(true);
        expect(this.burnedMen.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
