describe('Sparrows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Sparrows'], inPlay: ['Devout Freerider'] },
            player2: { power: 2 }
        });
        this.player1.clickCard(this.sparrows);
        this.player1.triggerAbility('Sparrows');
        this.player1.clickCard(this.player2Object.faction);
        this.player1.clickCard(this.devoutFreerider);
    });

    it("moves 1 power from an opponent's faction card to another The Seven card you control after it comes out of shadows", function () {
        expect(this.player2Object.faction.power).toBe(1);
        expect(this.devoutFreerider.power).toBe(1);
    });
});
