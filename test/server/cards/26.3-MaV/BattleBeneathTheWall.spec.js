describe('Battle Beneath the Wall (MaV)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Battle Beneath the Wall (MaV)'],
                inPlay: ['Tumblestone Knight', 'Eddard Stark (Core)']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.selectPlot('Battle Beneath the Wall (MaV)');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Military');
        this.completeMarshalPhase();
        this.player1.clickPrompt('Military');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
    });

    it('makes each player declare every eligible character as an attacker or defender in challenges of the named type', function () {
        expect(this.tumblestoneKnight.isAttacking()).toBe(true);
        expect(this.eddardStark.isAttacking()).toBe(true);
        expect(this.burnedMen.isDefending()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
