describe('Living Shadow', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'baratheon', inPlay: ['Living Shadow'] },
            player2: { inPlay: ['Hedge Knight'] }
        });
    });

    it('cannot be killed', function () {
        expect(this.livingShadow.canBeKilled()).toBe(false);
    });

    it('attaches itself to the character it bypasses using stealth as a Condition that stops it being saved', function () {
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.livingShadow);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.hedgeKnight);
        expect(this.livingShadow.parent).toBe(this.hedgeKnight);
        expect(this.livingShadow.getType()).toBe('attachment');
        expect(this.livingShadow.hasTrait('Condition')).toBe(true);
        expect(this.livingShadow.isTerminal()).toBe(true);
        expect(this.hedgeKnight.canBeSaved()).toBe(false);
    });
});
