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

    describe('when Sweetrobin removes the revealed card from the game', function () {
        function setupWithSweetrobin(context, opponentHand) {
            context.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        { card: 'Hedge Knight', attachments: ['Greyscale'] },
                        'Burned Men',
                        'Sweetrobin'
                    ]
                },
                player2: { plot: 'Sneak Attack', hand: opponentHand }
            });
            context.knight = context.player1.findCardByName('Hedge Knight', 'play area');
            context.greyscale = context.player1.findCardByName('Greyscale', 'play area');
            context.player1.togglePromptedActionWindow('dominance', true);
            context.completeChallengesPhase();
            context.player1.clickCard(context.greyscale);
            context.player1.triggerAbility('Sweetrobin');
        }

        it("still kills the attached character and moves when the removed card's printed cost is as high", function () {
            setupWithSweetrobin(this, ['Ser Jaime Lannister (Core)']);
            expect(this.serJaimeLannister.location).toBe('out of game');
            expect(this.player1).not.toBeAbleToSelect(this.knight);
            expect(this.player1).toBeAbleToSelect(this.burnedMen);
            expect(this.player1).toBeAbleToSelect(this.sweetrobin);

            this.player1.clickCard(this.burnedMen);

            expect(this.greyscale.parent).toBe(this.burnedMen);
            expect(this.knight.location).toBe('dead pile');
            expect(this.sweetrobin.location).toBe('play area');
            expect(this.player2Object.hand).toHaveLength(0);
            expect(this.player2).isReadyToTakeAction();
        });

        it("still has that player draw 1 card when the removed card's printed cost is lower", function () {
            setupWithSweetrobin(this, ['Winterfell Steward']);
            expect(this.winterfellSteward.location).toBe('out of game');
            expect(this.knight.location).toBe('play area');
            expect(this.greyscale.parent).toBe(this.knight);
            expect(this.player2Object.hand).toHaveLength(1);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
