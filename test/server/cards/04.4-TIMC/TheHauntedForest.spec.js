describe('The Haunted Forest', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['The Haunted Forest', 'The Haunted Forest'] },
            player2: { inPlay: ['Steward at the Wall', 'Maester Aemon (Core)'] }
        });
        [this.forest1, this.forest2] = this.player1.filterCardsByName(
            'The Haunted Forest',
            'play area'
        );
    });

    describe('when the challenge can be won by the STR it provides', function () {
        beforeEach(function () {
            this.player2.clickPrompt('Intrigue');
            this.player2.clickCard(this.stewardAtTheWall);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
        });

        it('contributes 1 STR to your side while you defend', function () {
            expect(this.game.currentChallenge.attackerStrength).toBe(1);
            expect(this.game.currentChallenge.defenderStrength).toBe(2);
        });

        it('wins the challenge', function () {
            this.skipActionWindow();

            expect(this.player2).not.toHavePrompt('Apply Claim');
            expect(this.forest1.kneeled).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when the challenge is lost', function () {
        beforeEach(function () {
            this.player2.clickPrompt('Intrigue');
            this.player2.clickCard(this.maesterAemon);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickPrompt('player1 - The Haunted Forest');
        });

        it('kneels each Haunted Forest', function () {
            expect(this.forest1.kneeled).toBe(true);
            expect(this.forest2.kneeled).toBe(true);
            expect(this.player2).isReadyToTakeAction();
        });

        it('stops the attacker gaining unopposed power', function () {
            expect(this.player2Object.getTotalPower()).toBe(0);
        });
    });
});
