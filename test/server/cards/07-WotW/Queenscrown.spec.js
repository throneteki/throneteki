import GameActions from '../../../../server/game/GameActions/index.js';

describe('Queenscrown', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('thenightswatch', ['A Game of Thrones', 'Queenscrown']);
            const deck2 = this.buildDeck('baratheon', [
                'A Noble Cause',
                'Fickle Bannerman',
                'The Iron Throne (Core)',
                'Consolidation of Power',
                'Saving the Kingdom',
                'Nightmares',
                'Milk of the Poppy',
                'Missandei'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck2);

            this.startGame();
            this.keepStartingHands();
            this.queenscrown = this.player1.findCardByName('Queenscrown');
            this.character = this.player2.findCardByName('Fickle Bannerman');
            this.location = this.player2.findCardByName('The Iron Throne (Core)');
            this.event = this.player2.findCardByName('Consolidation of Power');
            this.missandei = this.player2.findCardByName('Missandei');
            this.player1.clickCard(this.queenscrown);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();

            this.player2.dragCard(this.location, 'draw deck');
            this.player2.dragCard(this.event, 'draw deck');
            this.player2.dragCard(this.character, 'draw deck');
        });

        describe('setupCardAbilities', function () {
            it('should kneel itself as a cost', function () {
                this.player1.clickMenu(this.queenscrown, "Reveal top 3 cards of opponent's deck");
                expect(this.queenscrown.kneeled).toBe(true);
            });

            it("should reveal the top 3 cards of the opponent's deck", function () {
                spyOn(GameActions, 'revealTopCards').and.callThrough();
                this.player1.clickMenu(this.queenscrown, "Reveal top 3 cards of opponent's deck");
                expect(GameActions.revealTopCards).toHaveBeenCalledWith(jasmine.any(Function));
            });
        });

        describe('revealed cards have a character', function () {
            it('should place the selected character in the opponent discard pile', function () {
                this.player1.clickMenu(this.queenscrown, "Reveal top 3 cards of opponent's deck");
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');
                expect(this.character.location).toBe('discard pile');
            });

            it('should place Missandei into the discard pile without triggering her ability', function () {
                this.player2.dragCard(this.missandei, 'draw deck');
                this.player1.clickMenu(this.queenscrown, "Reveal top 3 cards of opponent's deck");
                this.player1.clickCard(this.missandei);
                this.player1.clickPrompt('Done');

                expect(this.player2).not.toAllowAbilityTrigger('Missandei');
                expect(this.missandei.location).toBe('discard pile');
            });
        });

        describe('revealed cards have no character', function () {
            it('should place all cards on the bottom of the opponent deck', function () {
                // Add the three non-character cards on top of the deck
                ['Saving the Kingdom', 'Nightmares', 'Milk of the Poppy'].forEach((card) => {
                    this.player2.dragCard(this.player2.findCardByName(card), 'draw deck');
                });

                this.player1.clickMenu(this.queenscrown, "Reveal top 3 cards of opponent's deck");
                this.player1.clickPrompt('Done');
                const length = this.player2Object.drawDeck.length;

                // All three cards should be on the bottom of the deck
                expect(this.player2Object.drawDeck[length - 1].name).toBe('Saving the Kingdom');
                expect(this.player2Object.drawDeck[length - 2].name).toBe('Nightmares');
                expect(this.player2Object.drawDeck[length - 3].name).toBe('Milk of the Poppy');
            });
        });
    });
});
