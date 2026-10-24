describe('Gwynesse Harlaw', function () {
    describe("with 3 cards in an opponent's discard pile", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Gwynesse Harlaw'] },
                player2: { discard: ['Hedge Knight', 'Castle Guard', 'Tumblestone Knight'] }
            });
            this.goldBefore = this.player1Object.gold;
            this.handBefore = this.player1Object.hand.length;
            this.player1.clickMenu(this.gwynesseHarlaw, 'Place cards on bottom');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickCard(this.castleGuard);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it("places them on the bottom of that player's deck, then gains 1 gold and draws 1 card", function () {
            expect(this.hedgeKnight.location).toBe('draw deck');
            expect(this.castleGuard.location).toBe('draw deck');
            expect(this.tumblestoneKnight.location).toBe('draw deck');
            expect(this.player1Object.gold).toBe(this.goldBefore + 1);
            expect(this.player1Object.hand).toHaveLength(this.handBefore + 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
