describe('Antler Men (BtB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Antler Men (BtB)', 'Tumblestone Knight']
            },
            player2: {
                power: 1
            }
        });

        this.unopposedChallenge(this.player1, 'Power', this.tumblestoneKnight);
        this.startingGold = this.player1Object.gold;
        this.player1.triggerAbility(this.antlerMen);
    });

    it('gains 1 gold after power is moved to your faction card', function () {
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});
