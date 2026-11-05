describe('The Watch Needs Good Men (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'The Watch Needs Good Men (TTS)'
            },
            player2: {
                discard: ['Tumblestone Knight']
            }
        });
    });

    it("lets you marshal characters from an opponent's discard pile", function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.tumblestoneKnight.controller).toBe(this.player1Object);
        expect(this.player1Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
