describe("The Mad King's Command", function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('targaryen', [
                "The Mad King's Command",
                'Aegon Targaryen',
                'Septa Lemore',
                'Beggar King'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.aegon = this.player1.findCardByName('Aegon Targaryen');
            this.lemore = this.player1.findCardByName('Septa Lemore');
            this.attachment = this.player1.findCardByName('Beggar King');

            this.player1.clickCard(this.aegon);
            this.player1.clickPrompt('Setup');
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when an attachment is chosen, but attached character is not', function () {
            beforeEach(function () {
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.aegon);
                this.completeMarshalPhase();
                this.player1.clickPrompt("player1 - The Mad King's Command");

                // P1 Choosing characters
                this.player1.clickPrompt('Done');
                // P1 Choosing attachments
                this.player1.clickCard(this.attachment);
                this.player1.clickPrompt('Done');
                // P1 Choosing cards in hand/shadow
                this.player1.clickPrompt('Done');
                // P2 Choosing characters
                this.player2.clickPrompt('Done');
                // P2 Choosing attachments
                this.player2.clickPrompt('Done');
                // P2 Choosing cards in hand/shadow
                this.player2.clickPrompt('Done');

                // Skip placement order
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
            });

            it("should return that attachment to it's owners hand", function () {
                expect(this.aegon.location).toBe('draw deck');
                expect(this.attachment.location).toBe('hand');
            });
        });

        describe('when a card not chosen would change locations before it is moved to deck', function () {
            beforeEach(function () {
                this.player1.clickCard(this.lemore);
                this.completeMarshalPhase();
                this.player1.clickPrompt("player1 - The Mad King's Command");

                // P1 Choosing characters
                this.player1.clickPrompt('Done');
                // P1 Choosing cards in hand/shadow
                this.player1.clickPrompt('Done');
                // P2 Choosing characters
                this.player2.clickPrompt('Done');
                // P2 Choosing cards in hand/shadow
                this.player2.clickPrompt('Done');

                // Trigger Lemore on Aegon
                this.player1.clickCard(this.lemore);
                this.player1.clickCard(this.aegon);

                // Skip placement order
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');
            });

            it('should not be moved to deck', function () {
                expect(this.lemore.location).toBe('draw deck');
                expect(this.aegon.location).toBe('shadows');
            });
        });
    });
});
