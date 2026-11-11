describe('Orphan of the Greenblood', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'martell',
                inPlay: [{ card: 'Orphan of the Greenblood', gold: 1 }, 'Tumblestone Knight']
            }
        });
        this.player1.clickCard(this.orphanOfTheGreenblood);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it("discards 1 gold to return another character you control to its owner's hand", function () {
        expect(this.orphanOfTheGreenblood.gold).toBe(0);
        expect(this.tumblestoneKnight.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
