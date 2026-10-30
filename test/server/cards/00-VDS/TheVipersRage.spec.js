describe("The Viper's Rage", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'martell', hand: ["The Viper's Rage"], gold: 2 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.khalDrogo);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility(this.theVipersRage);
    });

    it('makes each character controlled by the attacking player lose a military, an intrigue and a power icon after you lose a challenge by 5 or more STR as the defender', function () {
        expect(this.khalDrogo.hasIcon('military')).toBe(false);
        expect(this.khalDrogo.hasIcon('power')).toBe(false);
        expect(this.player2).isReadyToTakeAction();
    });
});
