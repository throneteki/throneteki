describe('The Tumblestone', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: 'The Tumblestone', gold: 1 },
                    { card: 'Tumblestone Knight', kneeling: true }
                ],
                hand: ['Riverrun Minstrel'],
                gold: 4
            }
        });
        this.player1.clickCard(this.riverrunMinstrel);
        this.player1.triggerAbility(this.riverrunMinstrel);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.theTumblestone);
    });

    it('discards 1 gold to stand a House Tully character after it gains power', function () {
        expect(this.theTumblestone.gold).toBe(0);
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
