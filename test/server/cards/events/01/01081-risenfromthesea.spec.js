/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('Risen from the Sea', function() {
    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Theon Greyjoy (Core)', 'Drowned Men', 'Risen from the Sea'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();


            this.character = this.player1.findCardByName('Theon Greyjoy', 'hand');
            this.noAttachmentCharacter = this.player1.findCardByName('Drowned Men', 'hand');
            this.event = this.player1.findCardByName('Risen from the Sea', 'hand');

            this.player1.clickCard(this.character);
            this.player1.clickCard(this.noAttachmentCharacter);
            this.player2.clickCard('Drowned Men', 'hand');
            this.completeSetup();

            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();

            this.unopposedChallenge(this.player2, 'military', 'Drowned Men');
            this.player2.clickPrompt('Apply Claim');
        });

        describe('when a character is killed', function() {
            beforeEach(function() {
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Risen from the Sea');
                this.player1.clickCard(this.character);
            });

            it('should save the character', function() {
                expect(this.character.location).toBe('play area');
            });

            it('should attach the event to the character', function() {
                expect(this.character.attachments).toContain(this.event);
            });

            it('should provide +1 STR', function() {
                // 3 base STR + 1 STR.
                expect(this.character.getStrength()).toBe(4);
            });
        });

        describe('when a no-attachments character is killed', function() {
            beforeEach(function() {
                this.player1.clickCard(this.noAttachmentCharacter);
                this.player1.clickPrompt('Risen from the Sea');
                this.player1.clickCard(this.noAttachmentCharacter);
            });

            it('should save the character', function() {
                expect(this.noAttachmentCharacter.location).toBe('play area');
            });

            it('should not attach the event to the character', function() {
                expect(this.noAttachmentCharacter.attachments.size()).toBe(0);
                expect(this.event.location).toBe('discard pile');
            });

            it('should not provide +1 STR', function() {
                // 3 base STR
                expect(this.noAttachmentCharacter.getStrength()).toBe(3);
            });
        });
    });
});
