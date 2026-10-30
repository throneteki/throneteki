describe('Winterfell Steward', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                gold: 10,
                hand: ['House Maester', 'Tumblestone Knight', 'Direwolf Pup'],
                inPlay: ['Winterfell Steward']
            }
        });

        this.player1.clickCard(this.winterfellSteward);
    });

    it('kneels to reduce the cost of the next [stark] character you marshal this phase by 1', function () {
        expect(this.winterfellSteward.kneeled).toBe(true);
        expect(this.game.getPlainTextLog()).toContain(
            'player1 kneels Winterfell Steward to reduce the cost of the next stark character they marshal this phase by 1'
        );

        this.player1.clickCard(this.houseMaester);
        expect(this.player1Object.gold).toBe(8);

        this.player1.clickCard(this.tumblestoneKnight);
        expect(this.player1Object.gold).toBe(7);

        this.player1.clickCard(this.direwolfPup);
        expect(this.player1Object.gold).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('expires at the end of the phase', function () {
        this.completeMarshalPhase();

        expect(this.player1Object.getCostReduction('marshal', this.tumblestoneKnight)).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
