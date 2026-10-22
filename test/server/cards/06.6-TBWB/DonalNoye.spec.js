describe('Donal Noye', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Donal Noye', gold: 1 }],
                hand: ['Lady Forlorn']
            }
        });
        this.player1.clickCard(this.donalNoye);
        this.player1.clickCard(this.ladyForlorn);
        this.player1.clickCard(this.donalNoye);
    });

    it('discards 1 gold to put a Weapon attachment into play from your hand', function () {
        expect(this.donalNoye.gold).toBe(0);
        expect(this.ladyForlorn.parent).toBe(this.donalNoye);
        expect(this.player1).isReadyToTakeAction();
    });
});
