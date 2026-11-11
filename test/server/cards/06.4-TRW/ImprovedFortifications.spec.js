describe('Improved Fortifications', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: "Brandon's Gift", attachments: ['Improved Fortifications'] }]
            },
            player2: { faction: 'greyjoy', hand: ['Newly-Made Lord'], gold: 4 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.newlyMadeLord);
        this.player2.triggerAbility(this.newlyMadeLord);
        this.player2.clickCard(this.brandonsGift);
        this.player1.triggerAbility(this.improvedFortifications);
    });

    it('sacrifices itself to save the attached location when it would leave play', function () {
        expect(this.improvedFortifications.location).toBe('discard pile');
        expect(this.brandonsGift.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
