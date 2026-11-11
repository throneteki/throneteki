describe('Maester Lomys', function () {
    describe('after you win an intrigue challenge as the defending player', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: ['Maester Lomys'] },
                player2: { inPlay: ['Steward at the Wall'], hand: ['Hot Pie (FFH)'] }
            });
            this.player2.clickPrompt('Intrigue');
            this.player2.clickCard(this.stewardAtTheWall);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.maesterLomys);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.triggerAbility(this.maesterLomys);
        });

        it("discards 1 card at random from the attacking player's hand", function () {
            expect(this.hotPie.location).toBe('discard pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
