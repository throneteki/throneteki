describe('Sweet Cersei', function () {
    describe('during the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Sweet Cersei', gold: 2 }, 'Maester Luwin'] }
            });
            this.spendable = this.player1Object.getSpendableGold({
                activePlayer: this.player1Object
            });
            this.unopposedChallenge(this.player1, 'Intrigue', this.maesterLuwin);
            this.player1.triggerAbility(this.sweetCersei);
        });

        it('lets you spend its gold, and places 1 gold on it after you win an intrigue challenge', function () {
            expect(this.spendable).toBe(this.player1Object.gold + 2);
            expect(this.sweetCersei.gold).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
