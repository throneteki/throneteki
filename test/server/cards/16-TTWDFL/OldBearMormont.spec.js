describe('Old Bear Mormont (TTWDFL)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Old Bear Mormont (TTWDFL)', { card: 'Maester Harmune', kneeling: true }]
            },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickCard(this.oldBearMormont);
        this.player1.clickCard(this.maesterHarmune);
    });

    it('kneels to stand another thenightswatch or Lord character, and stands after a character you control is killed', function () {
        expect(this.maesterHarmune.kneeled).toBe(false);
        expect(this.oldBearMormont.kneeled).toBe(true);

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.maesterHarmune);
        this.player1.triggerAbility(this.oldBearMormont);

        expect(this.oldBearMormont.kneeled).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
