describe('Jhogo (TS)', function () {
    describe('while attacking with another Bloodrider', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Jhogo (TS)', 'Aggo'] },
                player2: { deadPile: ['Hedge Knight', 'Castle Guard'] }
            });
            expect(this.jhogo.hasKeyword('Stealth')).toBe(true);
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.jhogo);
            this.player1.clickPrompt('Done');
        });

        it("gains stealth, and gets +1 STR for each character in the defending player's dead pile", function () {
            expect(this.jhogo.getStrength()).toBe(this.jhogo.getPrintedStrength() + 2);
        });
    });
});
