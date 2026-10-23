describe('Hired Assassin', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Hired Assassin'], gold: 2 },
            player2: { shadows: ['Hedge Knight', 'Nightmares'] }
        });
        this.player1.clickCard(this.hiredAssassin);
        this.player1.triggerAbility('Hired Assassin');
    });

    it("looks at a card in shadows and may place a character in its owner's dead pile", function () {
        this.player1.clickCard(this.hedgeKnight);
        expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('may leave the character in shadows', function () {
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });

    it('only looks at a card that is not a character', function () {
        this.player1.clickCard(this.nightmares);
        expect(this.player1).toHavePrompt('Look at cards');
        this.player1.clickPrompt('Done');
        expect(this.nightmares.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
