describe('Grand Maester Pycelle (TTS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                agenda: 'Fealty',
                hand: ['Tumblestone Knight'],
                inPlay: ['Grand Maester Pycelle (TTS)']
            },
            player2: {
                inPlay: ['House Maester']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Intrigue', this.houseMaester);
    });

    it("places a card discarded from a player's hand facedown under their agenda", function () {
        this.player1.triggerAbility(this.grandMaesterPycelle);

        expect(this.tumblestoneKnight.location).toBe('underneath');
        expect(this.tumblestoneKnight.parent).toBe(this.player1Object.agenda);
        expect(this.tumblestoneKnight.facedown).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
