describe('The Iron Bank Will Have Its Due', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Robb Stark (Core)'], hand: ['The Iron Bank Will Have Its Due'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.theIronBankWillHaveItsDue);
        this.player1.clickCard(this.robbStark);
    });

    it('returns a character to hand to gain gold equal to its cost, and stops it being marshaled', function () {
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.robbStark.location).toBe('hand');
        expect(this.player1Object.gold).toBe(this.startingGold + this.robbStark.getPrintedCost());
        expect(this.player1Object.canPutIntoPlay(this.robbStark, 'marshal')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
