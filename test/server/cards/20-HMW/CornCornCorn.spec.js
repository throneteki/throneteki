describe('Corn, Corn, Corn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Steward at the Wall', 'Castle Guard'],
                hand: ['Corn, Corn, Corn']
            },
            player2: { inPlay: ['Hedge Knight'], power: 1 }
        });
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('kneels a Steward when the challenges phase ends to have an opponent satisfy claim of a type not initiated against you', function () {
        this.player1.clickCard(this.cornCornCorn);
        this.player1.clickCard(this.stewardAtTheWall);
        expect(this.player1).not.toHavePromptButton('Military');
        this.player1.clickPrompt('Power');
        expect(this.player1Object.faction.power).toBe(1);
        expect(this.player2Object.faction.power).toBe(1);
    });
});
