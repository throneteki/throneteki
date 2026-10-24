describe('Friends at Court', function () {
    function setup(context, gold) {
        context.setupTest({
            phase: 'marshal',
            player1: { shadows: ['Friends at Court'], gold },
            player2: { shadows: ['Hedge Knight', 'Nightmares'] }
        });
        context.player1.clickCard(context.friendsAtCourt);
        context.player1.triggerAbility('Friends at Court');
        context.player1.clickCard(context.hedgeKnight);
        context.player1.clickCard(context.nightmares);
        context.player1.clickPrompt('Done');
    }

    it("looks at up to 3 cards in shadows, then may pay 2 gold to return 1 to its owner's hand", function () {
        setup(this, 4);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.nightmares.location).toBe('shadows');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('only looks at the cards when you cannot pay 2 gold', function () {
        setup(this, 2);
        expect(this.player1).toHavePrompt('Look at cards');
        this.player1.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('shadows');
        expect(this.player1).isReadyToTakeAction();
    });
});
