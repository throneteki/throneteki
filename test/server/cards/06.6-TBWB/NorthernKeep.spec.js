describe('Northern Keep', function () {
    function setup(plot) {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Northern Keep'] },
            player2: { plot }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.northernKeep);
    }

    it('kneels to gain 1 gold', function () {
        setup.call(this, 'Filler Plot');
        expect(this.northernKeep.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(this.startingGold + 1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('gains 2 gold instead with more Winter than Summer plots revealed', function () {
        setup.call(this, 'Famine');
        expect(this.player1Object.gold).toBe(this.startingGold + 2);
        expect(this.player1).isReadyToTakeAction();
    });
});
