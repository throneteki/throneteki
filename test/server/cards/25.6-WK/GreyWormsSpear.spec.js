describe("Grey Worm's Spear (WK)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Grey Worm (JS)', attachments: ["Grey Worm's Spear (WK)"] }]
            },
            player2: {
                inPlay: ['Tumblestone Knight']
            }
        });

        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.greyWorm);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);
        this.player2.clickPrompt('Done');
    });

    it('gives Grey Worm a [power] icon and intimidate, and each defending character -1 STR while the attached character attacks', function () {
        expect(this.greyWorm.hasIcon('power')).toBe(true);
        expect(this.greyWorm.hasKeyword('Intimidate')).toBe(true);
        expect(this.tumblestoneKnight.getStrength()).toBe(1);

        this.skipActionWindow();
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.player1).isReadyToTakeAction();
    });
});
