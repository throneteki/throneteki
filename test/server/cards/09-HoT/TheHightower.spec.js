describe('The Hightower', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['The Hightower'],
                hand: ['Garden Caretaker'],
                drawDeck: ['Castle Guard']
            }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.gardenCaretaker);
        this.player1.triggerAbility('The Hightower');
    });

    it('gains 1 gold and draws 1 card after a tyrell character enters play under your control', function () {
        expect(this.player1Object.gold).toBe(this.startingGold - 1 + 1);
        expect(this.castleGuard.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
