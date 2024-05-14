import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Lingering Venom', function () {
    integration(function () {
        describe('when losing a challenge', function () {
            beforeEach(function () {
                const deck = this.buildDeck('martell', [
                    'A Noble Cause',
                    'Lingering Venom',
                    'House Dayne Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('House Dayne Knight', 'hand');
                this.venom = this.player2.findCardByName('Lingering Venom', 'hand');

                this.player1.clickCard(this.character);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.player1.clickPrompt('Done');

                this.player2.clickCard(this.venom);
                this.player2.clickCard(this.character);

                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.triggerAbility(this.venom);
            });

            it('places a venom token', function () {
                expect(this.character.location).toBe('play area');
                expect(this.venom.tokens[Tokens.venom]).toBe(1);
            });

            describe('when the number of tokens equal the character STR', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Apply Claim');

                    // Restand the character
                    this.player1.clickCard(this.character);

                    this.player1.clickPrompt('Military');
                    this.player1.clickCard(this.character);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player2.triggerAbility(this.venom);
                });

                it('kills the character', function () {
                    expect(this.character.location).toBe('dead pile');
                });
            });
        });
    });
});
