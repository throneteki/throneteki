describe('Lordsport Fisherman', function () {
    describe('after you marshal it', function () {
        beforeEach(function () {
            this.setupTest({ phase: 'marshal', player1: { hand: ['Lordsport Fisherman'] } });
            this.bottomCard = this.player1Object.drawDeck.slice(-1)[0];
            this.player1.clickCard(this.lordsportFisherman);
            this.player1.triggerAbility(this.lordsportFisherman);
        });

        it('adds the bottom card of your deck to your hand', function () {
            expect(this.bottomCard.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
