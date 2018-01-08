describe('Risen from the Sea', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('greyjoy', [
                'A Noble Cause',
                'Asha Greyjoy (Core)', 'Theon Greyjoy (Core)', 'Drowned Men', 'Risen from the Sea'
            ]);
            const deck2 = this.buildDeck('targaryen', [
                'A Noble Cause',
                'Drogon', 'Viserion', 'Dracarys!'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();


            this.character = this.player1.findCardByName('Theon Greyjoy', 'hand');
            this.noAttachmentCharacter = this.player1.findCardByName('Drowned Men', 'hand');
            this.event = this.player1.findCardByName('Risen from the Sea', 'hand');

            this.player1.clickCard(this.character);
            this.player1.clickCard(this.noAttachmentCharacter);
            this.player2.clickCard('Drogon', 'hand');
            this.player2.clickCard('Viserion', 'hand');
            this.completeSetup();

            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player2);

            this.completeMarshalPhase();
        });

        describe('when a character is killed normally', function() {
            beforeEach(function() {
                this.unopposedChallenge(this.player2, 'military', 'Viserion');
                this.player2.clickPrompt('Apply Claim');

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
                this.unopposedChallenge(this.player2, 'military', 'Viserion');
                this.player2.clickPrompt('Apply Claim');

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

        describe('when a character is killed via burn', function() {
            beforeEach(function() {
                this.strongCharacter = this.player1.findCardByName('Asha Greyjoy', 'hand');

                this.player1.dragCard(this.strongCharacter, 'play area');

                this.player2.clickPrompt('Military');
                this.player2.clickCard('Viserion', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickCard(this.character);
                this.player1.clickCard(this.strongCharacter);
                this.player1.clickCard(this.noAttachmentCharacter);
                this.player1.clickPrompt('Done');

                this.player2.clickCard('Dracarys!', 'hand');
                this.player2.clickCard('Drogon', 'play area');
            });

            describe('when that character can reach 1 STR through Risen', function() {
                beforeEach(function() {
                    this.player2.clickCard(this.strongCharacter);

                    this.player1.clickPrompt('Risen from the Sea');
                    this.player1.clickCard(this.strongCharacter);
                });

                it('should save the character', function() {
                    expect(this.strongCharacter.location).toBe('play area');
                    expect(this.strongCharacter.getStrength()).toBe(1);
                });
            });

            describe('when that character could reach 1 STR but cannot because it disallows attachments', function() {
                beforeEach(function() {
                    this.noAttachmentCharacter.modifyStrength(1);
                    this.player2.clickCard(this.noAttachmentCharacter);
                });

                it('should not prompt to save the character', function() {
                    expect(this.player1).not.toHavePromptButton('Risen from the Sea');
                });

                it('should kill the character', function() {
                    expect(this.noAttachmentCharacter.location).toBe('dead pile');
                });
            });

            describe('when that character cannot reach 1 STR through Risen', function() {
                beforeEach(function() {
                    this.player2.clickCard(this.character);
                });

                it('should not prompt to save the character', function() {
                    expect(this.player1).not.toHavePromptButton('Risen from the Sea');
                });

                it('should kill the character', function() {
                    expect(this.character.location).toBe('dead pile');
                });
            });
        });
    });
});
