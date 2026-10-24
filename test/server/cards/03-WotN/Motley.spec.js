describe('Motley', function () {
    describe('after the attached character is declared as an attacker', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { hand: ['Motley'] },
                player2: { inPlay: ['Castle Guard'], hand: ['Hot Pie (FFH)'] }
            });
            this.player1.clickCard(this.motley);
            this.player1.clickCard(this.castleGuard);
            expect(this.castleGuard.hasTrait('Fool')).toBe(true);
            this.completeMarshalPhase();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.castleGuard);
            this.player2.clickPrompt('Done');
            this.player1.triggerAbility(this.motley);
        });

        it("discards 1 card at random from its controller's hand", function () {
            expect(this.hotPie.location).toBe('discard pile');
        });
    });
});
