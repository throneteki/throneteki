describe('Former Champion (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: [{ card: 'Former Champion (TSoW)', power: 4 }]
            }
        });
    });

    it('gets -1 STR for each power, and gains icons and keywords as its STR drops', function () {
        expect(this.formerChampion.getStrength()).toBe(1);
        expect(this.formerChampion.hasIcon('power')).toBe(true);
        expect(this.formerChampion.hasKeyword('Stealth')).toBe(true);
        expect(this.formerChampion.hasIcon('intrigue')).toBe(true);
        expect(this.formerChampion.hasKeyword('Intimidate')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
