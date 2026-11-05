describe('Scheming Septon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Scheming Septon'], drawDeck: ['Hedge Knight'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickMenu(this.schemingSepton, 'Draw 1 card and gain 2 gold');
    });

    it('draws 1 card and gains 2 gold, then places itself on top of your deck', function () {
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1Object.drawDeck[0]).toBe(this.schemingSepton);
        expect(this.player1).isReadyToTakeAction();
    });
});
