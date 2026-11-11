describe('Defending the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Defending the Wall'], inPlay: ['The Wall (Core)'] },
            player2: { inPlay: ['Cersei Lannister (Core)'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.cerseiLannister);
        this.player2.clickPrompt('Done');
        this.player1.clickCard(this.defendingTheWall);
        this.player1.clickCard(this.cerseiLannister);
    });

    it('removes an attacking character with more than 1 icon from the challenge and stands it', function () {
        expect(this.cerseiLannister.isAttacking()).toBe(false);
        expect(this.cerseiLannister.kneeled).toBe(false);

        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.player2).isReadyToTakeAction();
    });
});
