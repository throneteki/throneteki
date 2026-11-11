describe('Lazy Leo', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Lazy Leo'], gold: 5 },
            player2: { discard: ['Hear Me Roar!', 'Nightmares', 'Hedge Knight'] }
        });
        this.player1.clickCard(this.lazyLeo);
        this.player1.triggerAbility('Lazy Leo');
        this.player1.clickCard(this.hearMeRoar);
        this.player1.clickCard(this.nightmares);
        this.player1.clickPrompt('Done');
    });

    it("shuffles any number of events from a player's discard pile into their deck", function () {
        expect(this.hearMeRoar.location).toBe('draw deck');
        expect(this.nightmares.location).toBe('draw deck');
        expect(this.hedgeKnight.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
