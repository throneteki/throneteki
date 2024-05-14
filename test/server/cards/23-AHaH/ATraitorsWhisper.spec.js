describe('A Traitor´s Whisper', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'Time of Plenty',
                "A Traitor's Whisper",
                'Sparrows',
                'Scheming Septon'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.whisper = this.player1.findCardByName("A Traitor's Whisper");
            this.sparrows = this.player1.findCardByName('Sparrows');
            this.septon = this.player1.findCardByName('Scheming Septon');
            this.sparrows2 = this.player2.findCardByName('Sparrows');
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe("after A Traitor's Whisper is used", function () {
            beforeEach(function () {
                this.player1.dragCard(this.sparrows, 'shadows');
                this.player2.dragCard(this.sparrows2, 'shadows');
                this.player1.dragCard(this.septon, 'discard pile');
                this.player1.clickCard(this.whisper);
            });

            it('it should let the player select a card in shadows from each player', function () {
                expect(this.player2).toHavePrompt(
                    "Waiting for opponent to use A Traitor's Whisper"
                );
                expect(this.player1).toHavePrompt(
                    'Select a card in each players shadow area, if able'
                );
                this.player1.clickCard(this.sparrows);
                this.player1.clickCard(this.sparrows2);
                this.player1.clickPrompt('Done');
            });

            it('it should ask the player to put the selected cards into play', function () {
                this.player1.clickCard(this.sparrows);
                this.player1.clickCard(this.sparrows2);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Put revealed cards into play?');
                this.player1.clickPrompt('Yes');
                expect(this.sparrows.location).toBe('play area');
                expect(this.sparrows2.location).toBe('play area');
            });
        });

        describe("after A Traitor's Whisper is used with only 1 card in shadows", function () {
            beforeEach(function () {
                this.player1.dragCard(this.sparrows, 'shadows');
                this.player1.dragCard(this.septon, 'discard pile');
                this.player1.clickCard(this.whisper);
            });

            it('it should let the player select a card in shadows from only one player', function () {
                expect(this.player2).toHavePrompt(
                    "Waiting for opponent to use A Traitor's Whisper"
                );
                expect(this.player1).toHavePrompt(
                    'Select a card in each players shadow area, if able'
                );
                this.player1.clickCard(this.sparrows);
                this.player1.clickPrompt('Done');
            });

            it('it should ask the player to put the selected cards into play', function () {
                this.player1.clickCard(this.sparrows);
                this.player1.clickPrompt('Done');
                expect(this.player1).toHavePrompt('Put revealed cards into play?');
                this.player1.clickPrompt('Yes');
                expect(this.sparrows.location).toBe('play area');
            });
        });
    });
});
