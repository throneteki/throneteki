describe('Xaro Xhoan Daxos', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Xaro Xhoan Daxos', 'Eddard Stark (Core)'],
                hand: ['Seal of the Hand'],
                gold: 3
            }
        });
        this.player1.clickCard(this.sealOfTheHand);
        this.player1.clickCard(this.eddardStark);
        this.player1.triggerAbility(this.xaroXhoanDaxos);
    });

    it('gains 2 gold after you marshal a unique attachment', function () {
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
