describe('Castamere', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Castamere', 'Cersei Lannister (Core)', 'Ser Jaime Lannister (Core)']
            },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickCard(this.serJaimeLannister);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.castamere);
    });

    it('kneels and sacrifices itself to apply military claim after an intrigue challenge you won by 5 or more STR', function () {
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');

        expect(this.castamere.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
