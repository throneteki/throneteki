describe('The Redwyne Fleet', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['The Redwyne Fleet', 'Paxter Redwyne (Core)']
            }
        });
    });

    it('gives Paxter Redwyne a [military] and a [power] icon and the Commander trait', function () {
        expect(this.paxterRedwyne.hasIcon('military')).toBe(true);
        expect(this.paxterRedwyne.hasIcon('power')).toBe(true);
        expect(this.paxterRedwyne.hasTrait('Commander')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains 1 gold after a House Redwyne card you control is knelt', function () {
        const gold = this.player1Object.gold;
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.theRedwyneFleet);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility(this.theRedwyneFleet);

        expect(this.player1Object.gold).toBe(gold + 1);

        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});
