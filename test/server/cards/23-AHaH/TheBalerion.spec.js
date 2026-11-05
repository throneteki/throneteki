describe('The Balerion', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['The Balerion', 'Unsullied', 'Captain Groleo'] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.unsullied);
        this.player1.clickPrompt('Done');
    });

    it('gives Captain Groleo a power icon and stealth, and kneels and shuffles itself into your deck to give a targaryen character +2 STR and assault', function () {
        expect(this.captainGroleo.hasIcon('power')).toBe(true);
        expect(this.captainGroleo.hasKeyword('stealth')).toBe(true);

        this.player1.clickCard(this.theBalerion);
        this.player1.clickCard(this.unsullied);

        expect(this.theBalerion.location).toBe('draw deck');
        expect(this.unsullied.getStrength()).toBe(5);
        expect(this.unsullied.hasKeyword('assault')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
