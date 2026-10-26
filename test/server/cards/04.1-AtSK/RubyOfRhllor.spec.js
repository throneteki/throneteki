describe("Ruby of R'hllor", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Acolyte of the Shadow (ChoS)', attachments: ["Ruby of R'hllor"] }]
            },
            player2: { hand: ['Hedge Knight', 'Hedge Knight', 'Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.acolyteOfTheShadow);
        this.player1.triggerAbility("Ruby of R'hllor");
        this.player1.nameCard('Hedge Knight');
        this.player2.clickPrompt('Done');
    });

    it("discards each card in the loser's hand with the named title", function () {
        const names = this.player2Object.hand.map((card) => card.name);
        expect(names).not.toContain('Hedge Knight');
    });
});

describe("Ruby of R'hllor revealing the loser's hand", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Acolyte of the Shadow (ChoS)', attachments: ["Ruby of R'hllor"] },
                    'Sweetrobin'
                ]
            },
            player2: { plot: 'Trading with the Pentoshi', hand: ['Hedge Knight', 'Castle Guard'] }
        });
        this.unopposedChallenge(this.player1, 'Intrigue', this.acolyteOfTheShadow);
        this.player1.triggerAbility("Ruby of R'hllor");
        this.player1.nameCard('Hedge Knight');
    });

    it('reveals it, so Sweetrobin can remove a revealed card from the game', function () {
        expect(this.player1).toAllowAbilityTrigger(this.sweetrobin);

        this.player1.triggerAbility(this.sweetrobin);

        expect(this.hedgeKnight.location).toBe('out of game');
        expect(this.player2Object.discardPile).toEqual([this.castleGuard]);
        expect(this.game.getPlainTextLog()).toContain('player2 discards Castle Guard at random');
        expect(this.player1).isReadyToTakeAction();
    });
});
