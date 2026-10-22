describe('Poisoned Dagger', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Lordsport Shipwright', attachments: ['Poisoned Dagger'] }]
            },
            player2: { inPlay: ['Steward at the Wall'] }
        });
        expect(this.lordsportShipwright.getStrength()).toBe(3);
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.lordsportShipwright);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.stewardAtTheWall);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.poisonedDagger);
        this.player2.clickCard(this.stewardAtTheWall);
    });

    it('gives the attached character +2 STR, and sacrifices itself to have the losing opponent kill a participating character after you win an intrigue challenge', function () {
        expect(this.poisonedDagger.location).toBe('discard pile');
        expect(this.stewardAtTheWall.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
