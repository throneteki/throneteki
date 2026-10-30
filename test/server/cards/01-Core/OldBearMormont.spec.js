describe('Old Bear Mormont (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Old Bear Mormont (Core)', 'The Wall (Core)']
            },
            player2: { inPlay: ['Ser Jaime Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.oldBearMormont);
        this.player1.clickPrompt('Done');
    });

    it('does not kneel when declared as a defender while you control The Wall', function () {
        expect(this.oldBearMormont.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Old Bear Mormont (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Old Bear Mormont (Core)'],
                hand: ['Old Forest Hunter']
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.oldBearMormont);
        this.player1.clickCard(this.oldForestHunter);
    });

    it('puts a thenightswatch card into play from your hand when the challenges phase ends if you did not lose a challenge as the defender', function () {
        expect(this.oldForestHunter.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
