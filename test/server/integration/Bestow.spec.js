describe('Bestow keyword', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'A Noble Cause',
                'Fortified Position',
                'Fickle Bannerman',
                'Hedge Knight',
                'Fever Dreams'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.bestowCharacter = this.player1.findCardByName('Fickle Bannerman', 'hand');
            this.bestowAttachment = this.player1.findCardByName('Fever Dreams', 'hand');
            this.opponentCharacter = this.player2.findCardByName('Hedge Knight', 'hand');

            this.player2.clickCard(this.opponentCharacter);
            this.completeSetup();
        });

        describe('when putting a bestow character into play', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.bestowCharacter);
            });

            it('should prompt for the amount of gold', function () {
                expect(this.player1).toHavePrompt('Select bestow amount for Fickle Bannerman');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).not.toHavePromptButton('3');
            });

            it('should move the selected amount of gold onto the card', function () {
                this.player1.clickPrompt('1');

                expect(this.bestowCharacter.tokens.gold).toBe(1);
                expect(this.player1Object.gold).toBe(1); // 5 from plot - 3 from character - 1 from bestow
            });
        });

        describe('when putting a bestow attachment into play', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.bestowAttachment);
            });

            it('should prompt for the amount of gold after selecting target character', function () {
                this.player1.clickCard(this.opponentCharacter);

                expect(this.player1).toHavePrompt('Select bestow amount for Fever Dreams');
                expect(this.player1).toHavePromptButton('Done');
                expect(this.player1).toHavePromptButton('1');
                expect(this.player1).toHavePromptButton('2');
                expect(this.player1).toHavePromptButton('3');
                expect(this.player1).not.toHavePromptButton('4');
            });

            it('should move the selected amount of gold onto the card', function () {
                this.player1.clickCard(this.opponentCharacter);
                this.player1.clickPrompt('3');

                expect(this.bestowAttachment.tokens.gold).toBe(3);
                expect(this.player1Object.gold).toBe(1); // 5 from plot - 1 from character - 3 from bestow
            });
        });

        describe('when Fortified Position is in play', function () {
            beforeEach(function () {
                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('Fortified Position');
                this.selectFirstPlayer(this.player1);

                this.player1.clickCard(this.bestowCharacter);
            });

            it('should not prompt for bestow', function () {
                expect(this.player1).not.toHavePrompt('Select bestow amount for Fickle Bannerman');
            });
        });
    });
});
