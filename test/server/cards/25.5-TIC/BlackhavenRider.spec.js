describe('Blackhaven Rider', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Shipborn Bastard'], hand: ['Blackhaven Rider (TIC)'] },
            player2: { inPlay: ['Bear Island Loyalist', 'Hedge Knight'] }
        });
        this.player1.clickCard(this.blackhavenRider);
        this.player1.triggerAbility('Blackhaven Rider');
    });

    it('has each player kneel a loyal character they control', function () {
        expect(this.player2).not.toAllowSelect(this.hedgeKnight);
        this.player1.clickCard(this.shipbornBastard);
        this.player2.clickCard(this.bearIslandLoyalist);
        expect(this.shipbornBastard.kneeled).toBe(true);
        expect(this.bearIslandLoyalist.kneeled).toBe(true);
        expect(this.hedgeKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
