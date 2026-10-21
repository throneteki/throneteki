describe('Kingdom of Shadows (BtRK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                agenda: 'Kingdom of Shadows (BtRK)',
                hand: ['Tumblestone Knight'],
                shadows: ['Ser Andrey Dalt']
            }
        });
    });

    it('increases the cost of each character you marshal by 1', function () {
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('reduces the cost of the first character you bring out of shadows each round by 2', function () {
        this.player1.clickCard(this.serAndreyDalt);

        expect(this.serAndreyDalt.location).toBe('play area');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });
});
