describe('Jon Snow (MoD)', function () {
    beforeEach(function () {
        this.setupTest({
            player1: {
                inPlay: ['Jon Snow (MoD)', 'Sworn Brother', 'Ranging Party', 'Steward at the Wall']
            }
        });
    });

    it('gains stealth, intimidate and insight while you control a Builder, a Ranger and a Steward character', function () {
        expect(this.jonSnow.hasKeyword('Stealth')).toBe(true);
        expect(this.jonSnow.hasKeyword('Intimidate')).toBe(true);
        expect(this.jonSnow.hasKeyword('Insight')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
