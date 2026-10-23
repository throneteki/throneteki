describe('Bitterbridge Encampment', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Time of Plenty'],
                inPlay: ['Bitterbridge Encampment'],
                hand: ['Hedge Knight']
            },
            player2: { hand: ['Castle Guard'] }
        });
        this.player1.selectPlot('Time of Plenty');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Bitterbridge Encampment');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
    });

    it('kneels after a Summer plot is revealed to have each player put a character into play from hand', function () {
        expect(this.bitterbridgeEncampment.kneeled).toBe(true);
        expect(this.hedgeKnight.location).toBe('play area');
        expect(this.castleGuard.location).toBe('play area');
    });
});
