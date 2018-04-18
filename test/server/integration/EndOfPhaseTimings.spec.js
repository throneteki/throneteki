describe('end of phase timings / WUA', function() {
    integration(function() {
        describe('Interrupts to "when the phase ends" vs "until the end of the phase"', function() {
            beforeEach(function() {
                const deck = this.buildDeck('baratheon', [
                    'A Game of Thrones',
                    'Varys', 'Nightmares'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                let varys = this.player1.findCardByName('Varys', 'hand');
                this.player1.clickCard(varys);

                this.completeSetup();
                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();

                this.player2.togglePromptedActionWindow('dominance', true);

                this.completeChallengesPhase();

                // Blank Varys
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(varys);
            });

            it('should keep "until the end of the phase" effects active until after interrupts to "when the phase ends"', function() {
                // Since Nightmares will not run out until after interrupts to
                // "when the phase ends", the player should not be able to
                // trigger Varys.
                expect(this.player1).not.toAllowAbilityTrigger('Varys');
            });
        });

        describe('"Until end of phase" vs "At end of phase"', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('baratheon', [
                    'A Game of Thrones',
                    'Shireen Baratheon'
                ]);
                const deck2 = this.buildDeck('martell', [
                    'A Game of Thrones',
                    'Nightmares', 'Areo Hotah (Core)', 'Venomous Blade'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.shireen = this.player1.findCardByName('Shireen Baratheon', 'hand');
                this.character = this.player2.findCardByName('Areo Hotah', 'hand');

                this.player1.clickCard(this.shireen);
                this.player2.clickCard(this.character);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();

                // Ambush Venomous Blade
                this.player2.clickCard('Venomous Blade', 'hand');
                this.player2.clickCard(this.character);
                this.player2.triggerAbility('Venomous Blade');
                this.player2.clickCard(this.shireen);

                expect(this.shireen.tokens.poison).toBe(1);

                // Blank Shireen
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(this.shireen);

                this.completeChallengesPhase();
            });

            it('should wear off "until end of phase" before "at end of phase" triggers', function() {
                // Nightmares wears off before the kill from Venomous Blade, so
                // Shireen should have an opportunity to kneel someone when she
                // dies.
                expect(this.player1).toAllowAbilityTrigger('Shireen Baratheon');
            });
        });
    });
});
