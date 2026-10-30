describe('Kingslayer', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Ser Rolly Duckfield (BtB)', attachments: ['Kingslayer'] }]
            },
            player2: { inPlay: [{ card: 'Hedge Knight', power: 2 }, 'Castle Guard'] }
        });
    });

    it('kneels the attached character to kill a character with 2 or more power', function () {
        this.player1.clickMenu(this.kingslayer, 'Kill character');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.serRollyDuckfield.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('dead pile');
    });

    it('has each opponent gain 2 power for their faction when the attached character leaves play', function () {
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        this.player1.clickCard(this.serRollyDuckfield);
        expect(this.serRollyDuckfield.location).toBe('dead pile');
        expect(this.player2Object.faction.power).toBe(2 + 1);
    });
});
