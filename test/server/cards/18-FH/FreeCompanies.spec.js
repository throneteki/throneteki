describe('Free Companies', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    agenda: 'Free Companies',
                    inPlay: ['Brown Ben Plumm', 'Hedge Knight', { card: 'Castle Guard', gold: 1 }]
                }
            });
            expect(this.hedgeKnight.getStrength()).toBe(1);
            this.player1.clickMenu(this.player1Object.agenda, 'Place gold');
        });

        it('kneels your faction card to place 1 gold on a card without gold or on a Mercenary', function () {
            expect(this.player1).toBeAbleToSelect(this.brownBenPlumm);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.castleGuard);
            this.player1.clickCard(this.hedgeKnight);
            expect(this.hedgeKnight.gold).toBe(1);
            expect(this.hedgeKnight.getStrength()).toBe(2);
            expect(this.player1Object.faction.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('on a Mercenary that already has gold', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    agenda: 'Free Companies',
                    inPlay: [{ card: 'Brown Ben Plumm', gold: 1 }]
                }
            });
            this.player1.clickMenu(this.player1Object.agenda, 'Place gold');
            this.player1.clickCard(this.brownBenPlumm);
        });

        it('still places the gold', function () {
            expect(this.brownBenPlumm.gold).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
