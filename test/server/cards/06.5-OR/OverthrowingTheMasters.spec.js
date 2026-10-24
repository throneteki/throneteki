describe('Overthrowing the Masters', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Khal Drogo (Core)'], hand: ['Overthrowing the Masters'], gold: 1 },
            player2: {
                inPlay: ['Tumblestone Knight'],
                deadPile: ['Hot Pie (FFH)', 'Hot Pie (ToJ)']
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.khalDrogo);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.overthrowingTheMasters);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("removes a defending character with STR up to the number of cards in the defending player's dead pile from the challenge", function () {
        expect(this.tumblestoneKnight.isParticipating()).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
