describe('Enameled Green Armor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Tumblestone Knight', attachments: ['Enameled Green Armor'] }]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.enameledGreenArmor);
    });

    it('gives the attached character renown, and kneels to have a participating character contribute its STR to your side', function () {
        expect(this.tumblestoneKnight.hasKeyword('renown')).toBe(true);

        this.player1.clickCard(this.burnedMen);

        expect(this.enameledGreenArmor.kneeled).toBe(true);
        expect(this.game.currentChallenge.attackerStrength).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });
});
