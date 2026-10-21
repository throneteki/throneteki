describe('Music of Dragons', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Music of Dragons'],
                drawDeck: ['Tumblestone Knight', 'Drogon (Core)']
            }
        });

        this.player1.clickCard(this.musicOfDragons);
    });

    it('searches your deck for a Dragon character and adds it to your hand', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.drogon);

        expect(this.drogon.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
