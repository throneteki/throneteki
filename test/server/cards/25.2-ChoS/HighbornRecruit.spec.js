describe('Highborn Recruit', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Highborn Recruit (ChoS)', 'Hedge Knight'] }
        });
        this.player1.clickMenu(this.highbornRecruit, 'Give character keyword');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Insight');
    });

    it('kneels to give a character with 1 or fewer icons insight or renown until the end of the phase', function () {
        expect(this.highbornRecruit.kneeled).toBe(true);
        expect(this.hedgeKnight.hasKeyword('Insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
