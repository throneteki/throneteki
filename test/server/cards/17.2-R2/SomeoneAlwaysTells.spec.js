describe('Someone Always Tells (R2)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'martell',
                hand: ['Someone Always Tells (R2)'],
                inPlay: ['Tumblestone Knight'],
                gold: 2
            },
            player2: { hand: ['Confinement'], gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.confinement);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.someoneAlwaysTells);
    });

    it("kneels your faction card to cancel the effects of an opponent's event", function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.tumblestoneKnight.hasIcon('military')).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
