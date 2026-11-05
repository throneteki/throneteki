describe('Ghiscari Elite', function () {
    describe('after it is knelt', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Ghiscari Elite'], discard: ['Nightmares'] }
            });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.ghiscariElite);
            this.player1.clickPrompt('Done');
            this.player1.triggerAbility(this.ghiscariElite);
            this.player1.clickCard(this.nightmares);
        });

        it('places an attachment or event from your discard pile on the bottom of your deck', function () {
            expect(this.nightmares.location).toBe('draw deck');
            expect(this.player1Object.drawDeck.slice(-1)[0]).toBe(this.nightmares);
        });
    });
});
