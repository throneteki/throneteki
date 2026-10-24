describe('Sellsails (HMW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'baratheon',
                inPlay: [
                    { card: 'Sellsails (HMW)', gold: 1 },
                    { card: 'Iron Fleet Scout', kneeling: true }
                ]
            }
        });
        this.player1.clickCard(this.sellsails);
        this.player1.clickCard(this.ironFleetScout);
    });

    it('discards 1 gold to stand a Smuggler or Warship card', function () {
        expect(this.sellsails.gold).toBe(0);
        expect(this.ironFleetScout.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
