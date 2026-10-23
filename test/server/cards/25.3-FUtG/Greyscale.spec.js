describe('Greyscale', function () {
    function setup(context, opponentHand) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Hedge Knight', attachments: ['Greyscale'] }, 'Burned Men']
            },
            player2: { hand: opponentHand }
        });
        context.knight = context.player1.findCardByName('Hedge Knight', 'play area');
        context.greyscale = context.player1.findCardByName('Greyscale', 'play area');
        context.player1.togglePromptedActionWindow('dominance', true);
        context.completeChallengesPhase();
        context.player1.clickCard(context.greyscale);
    }

    it("kills the attached character and moves to a different character when the revealed card's printed cost is as high", function () {
        setup(this, ['Ser Jaime Lannister (Core)']);
        expect(this.greyscale.kneeled).toBe(true);
        expect(this.player1).not.toBeAbleToSelect(this.knight);
        this.player1.clickCard(this.burnedMen);
        expect(this.greyscale.parent).toBe(this.burnedMen);
        expect(this.knight.location).toBe('dead pile');
    });

    it('otherwise has that player draw 1 card', function () {
        setup(this, ['Winterfell Steward']);
        expect(this.knight.location).toBe('play area');
        expect(this.player2Object.hand).toHaveLength(2);
    });
});
