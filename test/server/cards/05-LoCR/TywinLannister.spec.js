describe('Tywin Lannister (LoCR)', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Tywin Lannister (LoCR)', 'Jojen Reed', 'Cersei Lannister (Core)', 'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'The Tickler', 'The Reader (TRtW)', 'Cersei Lannister (Core)', 'Hedge Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Tywin Lannister', 'hand');
            this.player1.clickCard('Jojen Reed', 'hand');
            this.player2.clickCard('The Tickler', 'hand');
            this.player2.clickCard('The Reader', 'hand');
            this.completeSetup();
            this.selectFirstPlayer(this.player1);

            // Move remaining cards back to draw deck so we have something to discard
            for(const card of this.player1Object.hand) {
                this.player1Object.moveCard(card, 'draw deck');
            }

            for(const card of this.player2Object.hand) {
                this.player2Object.moveCard(card, 'draw deck');
            }
        });

        describe('when a single card discard occurs', function() {
            beforeEach(function() {
                this.cersei = this.player1.findCardByName('Cersei Lannister');
                this.knight = this.player1.findCardByName('Hedge Knight');

                this.player1.togglePromptedActionWindow('dominance', true);

                this.completeMarshalPhase();
                this.completeChallengesPhase();
                this.player2.clickMenu('The Tickler', 'Discard opponents top card');
            });

            it('should allow Tywin to choose to trigger', function() {
                this.player1.triggerAbility('Tywin Lannister');
                this.player1.clickPrompt('Hedge Knight');
                expect(this.cersei.location).toBe('draw deck');
                expect(this.knight.location).toBe('discard pile');
            });
        });

        describe('when a multiple card discard occurs', function() {
            beforeEach(function() {
                this.cersei = this.player1.findCardByName('Cersei Lannister');
                this.knight = this.player1.findCardByName('Hedge Knight');

                this.completeMarshalPhase();

                // Challenge prompt for Player 1
                this.player1.clickPrompt('Done');

                // Challenge prompt for Player 2
                this.player2.clickPrompt('Power');
                this.player2.clickCard('The Reader', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Player 1 does not oppose
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                // Trigger The Reader
                this.player2.triggerAbility('The Reader');
                this.player2.clickPrompt('Discard 3 cards');
            });

            it('should not allow Tywin to choose to trigger', function() {
                expect(this.player1).not.toAllowAbilityTrigger('Tywin Lannister');
            });
        });

        describe('when 1 card is discarded from multiple decks simultaneously', function() {
            beforeEach(function() {
                this.cerseiP1 = this.player1.findCardByName('Cersei Lannister');
                this.knightP1 = this.player1.findCardByName('Hedge Knight');
                this.cerseiP2 = this.player2.findCardByName('Cersei Lannister');
                this.knightP2 = this.player2.findCardByName('Hedge Knight');

                this.completeMarshalPhase();

                // Kneel & Stand Jojen to trigger his ability
                this.player1.clickCard('Jojen Reed', 'play area');
                this.player1.clickCard('Jojen Reed', 'play area');
                this.player1.triggerAbility('Jojen Reed');

                // Choose to discard cards
                this.player1.clickPrompt('Discard revealed cards');
            });

            it('should allow Tywin to trigger for each players discard', function() {
                // Trigger on player1's discard
                this.player1.triggerAbility('Tywin Lannister');
                // Need to choose which discard you want to trigger on first, since this is simultaneous
                this.player1.clickCard(this.player1Object.drawDeck[0]);
                this.player1.clickPrompt('Hedge Knight');

                // Trigger on player2's discard
                this.player1.triggerAbility('Tywin Lannister');
                this.player1.clickPrompt('Hedge Knight');

                expect(this.cerseiP1.location).toBe('draw deck');
                expect(this.knightP1.location).toBe('discard pile');
                expect(this.cerseiP2.location).toBe('draw deck');
                expect(this.knightP2.location).toBe('discard pile');
            });
        });

        describe('when pillage occurs', function() {
            beforeEach(function() {
                this.cersei = this.player2.findCardByName('Cersei Lannister');
                this.knight = this.player2.findCardByName('Hedge Knight');

                this.completeMarshalPhase();

                // Challenge prompt for Player 1
                this.player1.clickPrompt('Power');
                this.player1.clickCard('Tywin Lannister', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                // Player 2 does not oppose
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');
            });

            it('should allow Tywin to choose to trigger', function() {
                this.player1.triggerAbility('Tywin Lannister');
                this.player1.clickPrompt('Hedge Knight');
                expect(this.cersei.location).toBe('draw deck');
                expect(this.knight.location).toBe('discard pile');
            });
        });
    });
});
