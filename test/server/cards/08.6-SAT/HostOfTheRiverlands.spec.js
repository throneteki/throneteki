describe('Host of the Riverlands', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Host of the Riverlands', gold: 1 }, 'Tumblestone Knight'],
                hand: ['Riverrun Minstrel'],
                gold: 4
            }
        });
        this.player1.clickCard(this.riverrunMinstrel);
        this.player1.triggerAbility(this.riverrunMinstrel);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.hostOfTheRiverlands);
    });

    it('discards 1 gold to give a House Tully character 1 more power after it gains power', function () {
        expect(this.hostOfTheRiverlands.gold).toBe(0);
        expect(this.tumblestoneKnight.power).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
