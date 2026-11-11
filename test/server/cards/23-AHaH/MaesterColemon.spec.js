describe('Maester Colemon', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Maester Colemon',
                    {
                        card: 'Robb Stark (Core)',
                        attachments: ['Milk of the Poppy', 'Seal of the Hand', 'Longclaw']
                    },
                    'Winterfell Steward',
                    'Sansa Stark (Core)'
                ]
            }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickMenu(this.maesterColemon, 'Move attachment');
    });

    it('chooses a Condition or Item attachment', function () {
        expect(this.player1).toBeAbleToSelect(this.milkOfThePoppy);
        expect(this.player1).toBeAbleToSelect(this.sealOfTheHand);
        expect(this.player1).not.toBeAbleToSelect(this.longclaw);
    });

    it('kneels to move it to another eligible character', function () {
        this.player1.clickCard(this.milkOfThePoppy);
        expect(this.player1).not.toBeAbleToSelect(this.robbStark);
        this.player1.clickCard(this.winterfellSteward);
        expect(this.maesterColemon.kneeled).toBe(true);
        expect(this.milkOfThePoppy.parent).toBe(this.winterfellSteward);
    });

    it('cannot move it to a character it is not allowed on', function () {
        this.player1.clickCard(this.sealOfTheHand);
        expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
        expect(this.player1).not.toBeAbleToSelect(this.maesterColemon);
        this.player1.clickCard(this.sansaStark);
        expect(this.sealOfTheHand.parent).toBe(this.sansaStark);
    });
});
