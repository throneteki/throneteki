describe('Support of Harlaw', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Iron Islands Fishmonger', attachments: ['Support of Harlaw'] },
                    'Refurbished Hulk'
                ]
            }
        });
        this.player1.clickMenu(this.supportOfHarlaw, 'Give keyword to parent');
        this.player1.clickCard(this.refurbishedHulk);
        this.player1.clickPrompt('Stealth');
    });

    it('kneels a Warship location to give the attached character a keyword until the end of the phase', function () {
        expect(this.refurbishedHulk.kneeled).toBe(true);
        expect(this.ironIslandsFishmonger.hasKeyword('Stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
