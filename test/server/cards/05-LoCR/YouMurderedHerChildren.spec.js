describe('You Murdered Her Children', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('martell', [
                'The Red Viper (Core)',
                'You Murdered Her Children (LoCR)',
                'The Boy King',
                'Long May He Reign',
                'A Noble Cause'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);

            this.startGame();
            this.keepStartingHands();
            this.viper = this.player1.findCardByName('The Red Viper (Core)', 'hand');
            this.youMurderedHerChildren = this.player1.findCardByName(
                'You Murdered Her Children (LoCR)',
                'hand'
            );
            this.kingAttachment = this.player1.findCardByName('The Boy King', 'hand');
            this.longMayHeReign = this.player1.findCardByName('Long May He Reign', 'hand');

            this.player1.clickCard(this.viper);
            this.player1.clickCard(this.kingAttachment);

            this.completeSetup();

            this.player1.clickCard(this.kingAttachment);
            this.player1.clickCard(this.viper);

            this.selectFirstPlayer(this.player1);
        });

        it('should double the strength of the target, then kill the target at the end of the phase', function () {
            this.completeMarshalPhase();
            this.player1.clickCard(this.youMurderedHerChildren);
            this.player1.clickCard(this.viper);
            expect(this.viper.getStrength()).toBe(14);
            this.completeChallengesPhase();
            expect(this.viper.location).toBe('dead pile');
        });

        it('should double the strength of the target until the end of the phase, even if the target remains in play', function () {
            this.player1.clickCard(this.longMayHeReign);
            this.player1.clickCard(this.viper);
            this.completeMarshalPhase();
            this.player1.clickCard(this.youMurderedHerChildren);
            this.player1.clickCard(this.viper);
            expect(this.viper.getStrength()).toBe(14);
            this.completeChallengesPhase();
            expect(this.viper.location).toBe('play area');
            expect(this.viper.getStrength()).toBe(7);
        });
    });
});
