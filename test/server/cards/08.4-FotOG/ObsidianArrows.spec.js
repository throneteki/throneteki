describe('Obsidian Arrows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [
                    {
                        card: 'Steward at the Wall',
                        attachments: [{ card: 'Obsidian Arrows', gold: 1 }]
                    }
                ]
            },
            player2: { inPlay: ['Littlefinger (Core)'] }
        });
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.stewardAtTheWall);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.littlefinger);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.obsidianArrows);
        this.player1.clickCard(this.littlefinger);
    });

    it('moves 1 gold to a defending character to give it -3 STR while the attached character is attacking', function () {
        expect(this.littlefinger.gold).toBe(1);
        expect(this.littlefinger.getStrength()).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});
