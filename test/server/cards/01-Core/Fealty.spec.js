describe('Fealty', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Fealty',
                gold: 10,
                hand: ['Direwolf Pup', 'Grey Wind (Core)', 'Summer (Core)']
            }
        });
    });

    describe('when used', function () {
        beforeEach(function () {
            this.player1.clickMenu(this.fealty, 'Kneel your faction card');
        });

        it('kneels your faction card', function () {
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Fealty to kneel their faction card and reduce the cost of the next loyal card they marshal or play this phase by 1'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('reduces the cost of the next loyal card you marshal by 1, and only that one', function () {
            this.player1.clickCard(this.direwolfPup);

            expect(this.player1Object.gold).toBe(8);

            this.player1.clickCard(this.greyWind);

            expect(this.player1Object.gold).toBe(4);

            this.player1.clickCard(this.summer);

            expect(this.player1Object.gold).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('expires at the end of the phase', function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            expect(this.player1Object.getCostReduction('marshal', this.greyWind)).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be used again while your faction card is kneeling', function () {
            expect(this.player1.actionUnavailableReason(this.fealty)).toBe('cost');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
