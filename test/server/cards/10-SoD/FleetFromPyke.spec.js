describe('Fleet From Pyke', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'greyjoy', inPlay: ['Fleet From Pyke'] },
            player2: { drawDeck: ['Sweet Cersei'] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.fleetFromPyke);
        this.player1.triggerAbility(this.fleetFromPyke);
        this.player1.clickPrompt('Intrigue');
    });

    it('gains a challenge icon of your choice after a character you control discards a location or attachment with pillage', function () {
        expect(this.sweetCersei.location).toBe('discard pile');
        expect(this.fleetFromPyke.hasIcon('intrigue')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
