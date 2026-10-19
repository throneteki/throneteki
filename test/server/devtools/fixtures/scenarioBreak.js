describe('Scenario break', function () {
    beforeEach(function () {
        this.setupTest({
            player1: { inPlay: ['Tumblestone Knight', 'Bastard in Hiding'] }
        });
    });

    it('stops part way through', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.scenarioBreak();
        this.player1.clickCard(this.bastardInHiding);
    });

    it('ignores assertions', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('reports an error part way through', function () {
        this.player1.clickPrompt('No such button');
    });
});
