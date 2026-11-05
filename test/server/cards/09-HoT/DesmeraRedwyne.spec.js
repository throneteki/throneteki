describe('Desmera Redwyne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Desmera Redwyne', 'Doran Martell (SoD)'], gold: 1 },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.player1.clickMenu(this.doranMartell, 'Remove character from challenge');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.triggerAbility('Desmera Redwyne');
    });

    it('pays 1 gold after a character is removed from a challenge to give it -1 STR until the end of the phase', function () {
        this.player1.clickPrompt('Give -1 STR');
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() - 1);
        expect(this.player1Object.gold).toBe(0);
    });

    it('or +2 STR', function () {
        this.player1.clickPrompt('Give +2 STR');
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() + 2);
    });
});
