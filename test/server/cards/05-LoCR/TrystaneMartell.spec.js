describe('Trystane Martell (LoCR)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Trystane Martell (LoCR)'] },
            player2: { inPlay: ['Ser Jaime Lannister (Core)', 'Burned Men'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.trystaneMartell);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serJaimeLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.trystaneMartell);
        this.player1.clickCard(this.burnedMen);
    });

    it('stops a character with lower STR being declared as a defender this phase after you lose a challenge he is participating in', function () {
        expect(this.burnedMen.allowGameAction('declareAsDefender')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
