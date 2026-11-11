describe('Beyond Reproach', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Beyond Reproach'],
                inPlay: [
                    {
                        card: 'Hedge Knight',
                        attachments: [{ card: 'Little Bird (Core)', owner: 'player2' }]
                    },
                    { card: 'Castle Guard', attachments: ['Little Bird (Core)'] }
                ]
            }
        });
        [this.opponentBird] = this.hedgeKnight.attachments;
        [this.ownBird] = this.castleGuard.attachments;
        this.player1.selectPlot('Beyond Reproach');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
    });

    it('sacrifices each attachment on a character its controller does not control', function () {
        expect(this.opponentBird.location).toBe('discard pile');
        expect(this.ownBird.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
