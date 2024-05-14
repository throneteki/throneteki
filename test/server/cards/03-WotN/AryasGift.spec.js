describe("Arya's Gift", function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('stark', [
                'A Noble Cause',
                'Winterfell Steward',
                'Bran Stark (Core)',
                'Milk of the Poppy',
                "Arya's Gift",
                'Fishing Net'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character1 = this.player1.findCardByName('Bran Stark', 'hand');
            this.character2 = this.player1.findCardByName('Winterfell Steward', 'hand');

            this.player1.clickCard(this.character1);
            this.player1.clickCard(this.character2);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);
        });

        describe('with a normal attachment', function () {
            beforeEach(function () {
                this.milk = this.player2.findCardByName('Milk of the Poppy', 'hand');

                // Attach Milk to the first character.
                this.player2.clickCard(this.milk);
                this.player2.clickCard(this.character1);

                this.completeMarshalPhase();

                this.player1.clickCard("Arya's Gift", 'hand');
                this.player1.clickCard(this.milk);
                this.player1.clickCard(this.character2);
            });

            it('should move the attachment to the new parent', function () {
                expect(this.milk.parent).toBe(this.character2);
            });

            it('should remove the attachment from the old parent', function () {
                expect(this.character1.attachments.includes(this.milk)).toBe(false);
            });

            it('should apply effects to the new parent', function () {
                expect(this.character2.isAnyBlank()).toBe(true);
            });

            it('should unapply effects from the old parent', function () {
                expect(this.character1.isAnyBlank()).toBe(false);
            });
        });

        describe('with an opponent-only attachment', function () {
            beforeEach(function () {
                this.net = this.player2.findCardByName('Fishing Net', 'hand');

                // Attach Fishing Net to the first character.
                this.player2.clickCard(this.net);
                this.player2.clickCard(this.character1);

                this.completeMarshalPhase();

                this.player1.clickCard("Arya's Gift", 'hand');
                this.player1.clickCard(this.net);
                this.player1.clickCard(this.character2);
            });

            it('should move the attachment to the new parent', function () {
                expect(this.net.parent).toBe(this.character2);
            });

            it('should remove the attachment from the old parent', function () {
                expect(this.character1.attachments).not.toContain(this.net);
            });
        });
    });
});
