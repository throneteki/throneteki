describe('Favors From the Crown', function () {
    describe('after a card with bestow enters play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { plot: 'Favors From the Crown', hand: ['Saltcliffe Sailor'] }
            });
            this.player1.clickCard(this.saltcliffeSailor);
            this.player1.clickPrompt('Done');
            this.player1.triggerAbility(this.favorsFromTheCrown);
        });

        it('places 1 gold from the treasury on it', function () {
            expect(this.saltcliffeSailor.gold).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
