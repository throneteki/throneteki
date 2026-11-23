describe('Genna Frey', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Genna Frey', 'Black Walder', 'Hedge Knight', 'Robb Stark (Core)']
            },
            player2: {
                hand: [
                    'Castle Guard',
                    'Tumblestone Knight',
                    'Winterfell Steward',
                    'Little Bird (Core)'
                ]
            }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.unopposedChallenge(this.player1, 'Power', this.robbStark);
        this.unopposedChallenge(this.player1, 'Intrigue', [this.gennaFrey, this.blackWalder]);
        this.player1.triggerAbility('Genna Frey');
        this.player2.clickPrompt('Done');
    });

    it('discards 2 cards at random in the third challenge with another attacking House Frey', function () {
        expect(this.player2Object.hand.length).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
