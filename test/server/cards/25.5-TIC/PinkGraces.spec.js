describe('Pink Graces', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('targaryen', [
                'Late Summer Feast',
                'Pink Graces',
                'Braided Warrior',
                'Temple of the Graces',
                'Maester Aemon (WotW)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.pinkGraces = this.player1.findCardByName('Pink Graces', 'hand');
            this.military1 = this.player1.findCardByName('Braided Warrior', 'hand');
            this.temple = this.player1.findCardByName('Temple of the Graces', 'hand');
            this.aemon = this.player2.findCardByName('Maester Aemon (WotW)', 'hand');
            this.military2 = this.player2.findCardByName('Braided Warrior', 'hand');
            this.player1.clickCard(this.pinkGraces);
            this.player1.clickCard(this.temple);
            this.player1.clickCard(this.military1);
            this.player2.clickCard(this.aemon);
            this.player2.clickCard(this.military2);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);
            this.completeMarshalPhase();
            // Ensure both players have at least 1 card in their draw deck (to draw for Pink Graces)
            this.player1Object.moveCard(
                this.player1.findCardByName('Maester Aemon', 'hand'),
                'draw deck'
            );
            this.player2Object.moveCard(
                this.player2.findCardByName('Temple of the Graces', 'hand'),
                'draw deck'
            );
        });

        describe('when a player applied military claim through a challenge', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player2, 'military', this.military2);
                // Pass Late Summer Feast
                this.player1.clickPrompt('No');
                this.player2.clickPrompt('Apply Claim');
                this.player1.clickCard(this.military1);
                this.completeChallengesPhase();
                // Pass Aemon trigger
                this.player2.clickPrompt('Pass');
            });

            it('should allow you to trigger Pink Graces', function () {
                expect(this.player1).toAllowAbilityTrigger(this.pinkGraces);
            });

            it('should prevent that player from drawing cards', function () {
                this.player1.triggerAbility(this.pinkGraces);
                // Player 2 would have prompt first (being first player)
                expect(this.player2).not.toHavePrompt('Draw 1 card from Pink Graces?');
                expect(this.player1).toHavePrompt('Draw 1 card from Pink Graces?');
            });
        });

        describe('when a player applied military claim through an effect', function () {
            beforeEach(function () {
                this.completeChallengesPhase();
                this.player2.triggerAbility(this.aemon);
                this.player2.clickPrompt('Military');
                this.player1.clickCard(this.military1);
            });

            it('should allow you to trigger Pink Graces', function () {
                expect(this.player1).toAllowAbilityTrigger(this.pinkGraces);
            });

            it('should prevent that player from drawing cards', function () {
                this.player1.triggerAbility(this.pinkGraces);
                // Player 2 would have prompt first (being first player)
                expect(this.player2).not.toHavePrompt('Draw 1 card from Pink Graces?');
                expect(this.player1).toHavePrompt('Draw 1 card from Pink Graces?');
            });
        });

        describe('when a player initiated military, but applied claim of another type', function () {
            beforeEach(function () {
                // Pass player2 challenges
                this.player2.clickPrompt('Done');
                this.unopposedChallenge(this.player1, 'military', this.military1);
                // Pass Late Summer Feast
                this.player2.clickPrompt('No');
                this.player1.clickPrompt('Apply Claim');
                this.player1.triggerAbility(this.temple);
                this.player1.clickCard(this.temple);
                this.player1.clickPrompt('Done');
                // Pass Aemon trigger
                this.player2.clickPrompt('Pass');
            });

            it('should allow you to trigger Pink Graces', function () {
                expect(this.player1).toAllowAbilityTrigger(this.pinkGraces);
            });

            it('should not prevent that player from drawing cards', function () {
                this.player1.triggerAbility(this.pinkGraces);
                // Player 2 would have prompt first (being first player)
                expect(this.player2).toHavePrompt('Draw 1 card from Pink Graces?');
                this.player2.clickPrompt('Yes');
                expect(this.player1).toHavePrompt('Draw 1 card from Pink Graces?');
            });
        });
    });
});
