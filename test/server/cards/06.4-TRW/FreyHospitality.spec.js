describe('Frey Hospitality', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Black Walder', 'Hedge Knight', 'Robb Stark (Core)'],
                hand: ['Frey Hospitality']
            },
            player2: { inPlay: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player2.clickCard(this.winterfellSteward);
        this.unopposedChallenge(this.player1, 'Power', this.robbStark);
        this.unopposedChallenge(this.player1, 'Intrigue', this.blackWalder);
        this.player1.triggerAbility('Frey Hospitality');
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
    });

    it('kills a character controlled by the loser after winning your third challenge with an attacking House Frey', function () {
        expect(this.castleGuard.location).toBe('dead pile');
    });
});
