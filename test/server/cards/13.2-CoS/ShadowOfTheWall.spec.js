describe('Shadow of the Wall', function () {
    function setup(plot) {
        this.setupTest({
            player1: {
                plot,
                inPlay: [
                    { card: 'Winterfell Steward', kneeling: true },
                    { card: 'Robb Stark (Core)', kneeling: true }
                ],
                shadows: ['Shadow of the Wall']
            }
        });
        this.player1.clickCard(this.shadowOfTheWall);
    }

    it('stands a character with 1 or fewer challenge icons', function () {
        setup.call(this, 'Filler Plot');
        expect(this.player1).not.toBeAbleToSelect(this.robbStark);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.kneeled).toBe(false);
        expect(this.shadowOfTheWall.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('returns to your hand if there is a Winter plot card revealed', function () {
        setup.call(this, 'The Winds of Winter');
        this.player1.clickCard(this.winterfellSteward);
        expect(this.winterfellSteward.kneeled).toBe(false);
        expect(this.shadowOfTheWall.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
