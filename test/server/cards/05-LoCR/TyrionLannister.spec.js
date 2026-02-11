describe('Tyrion Lannister (LoCR)', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', [
                'Tyrion Lannister (LoCR)',
                'Burned Men',
                'A Noble Cause'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);

            this.startGame();
            this.keepStartingHands();

            this.tyrion = this.player1.findCardByName('Tyrion Lannister (LoCR)', 'hand');
            this.clansmen = this.player1.findCardByName('Burned Men', 'hand');

            this.player1.clickCard(this.tyrion);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.clansmen);
        });

        it('should prevent card draw when there are no cards in deck', function () {
            this.completeMarshalPhase();

            this.unopposedChallenge(this.player1, 'military', this.clansmen);
            this.player1.triggerAbility('Tyrion Lannister');
            this.player1.clickCard(this.clansmen);
            expect(this.player1).toHaveDisabledPromptButton('Draw 2 cards');
        });

        it('should enable claim raise', function () {
            this.completeMarshalPhase();

            this.unopposedChallenge(this.player1, 'military', this.clansmen);
            this.player1.triggerAbility('Tyrion Lannister');
            this.player1.clickCard(this.clansmen);
            expect(this.player1).toHavePromptButton('Raise claim by 1');
            this.player1.clickPrompt('Raise claim by 1');
            expect(this.player1Object.getClaim()).toBe(2);
        });
    });
});
