describe('Melisandre (FotS)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Melisandre (FotS)'] },
            player2: { inPlay: [{ card: 'Hedge Knight', power: 1 }] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.melisandre);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Melisandre');
        this.player1.clickCard(this.hedgeKnight);
    });

    it('moves 1 power from a losing character to Melisandre, then kills it if it has no power', function () {
        expect(this.melisandre.power).toBe(1);
        expect(this.hedgeKnight.location).toBe('dead pile');
    });
});
