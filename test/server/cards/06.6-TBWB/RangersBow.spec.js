describe("Ranger's Bow", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Steward at the Wall', attachments: ["Ranger's Bow"] }]
            },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Intrigue');
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickPrompt('Done');
    });

    it('gives the attached character +1 STR, and kneels to give a defending thenightswatch character +2 STR until the end of the challenge', function () {
        expect(this.stewardAtTheWall.getStrength()).toBe(2);

        this.player1.clickCard(this.rangersBow);
        this.player1.clickCard(this.stewardAtTheWall);

        expect(this.stewardAtTheWall.getStrength()).toBe(4);
        expect(this.player2).isReadyToTakeAction();
    });
});
