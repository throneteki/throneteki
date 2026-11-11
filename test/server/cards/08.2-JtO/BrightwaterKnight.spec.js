describe('Brightwater Knight', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [{ card: 'Brightwater Knight', gold: 1 }],
                hand: ['Tumblestone Knight'],
                gold: 0
            }
        });
        this.player1.clickCard(this.brightwaterKnight);
    });

    it('discards 1 gold to reduce the cost of the next Knight you marshal this phase by 2', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.brightwaterKnight.gold).toBe(0);
        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
