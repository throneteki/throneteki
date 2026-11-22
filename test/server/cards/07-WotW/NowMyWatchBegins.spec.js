describe('Now My Watch Begins', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'thenightswatch',
                hand: ['Dissension', 'Now My Watch Begins'],
                gold: 4
            },
            player2: { inPlay: ['Winterfell Steward'] }
        });
        this.player1.clickCard(this.dissension);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.triggerAbility(this.nowMyWatchBegins);
    });

    it("puts a character with printed cost 5 or lower into play under your control after it is placed in an opponent's discard pile", function () {
        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.winterfellSteward.controller).toBe(this.player1Object);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Now My Watch Begins after Queenscrown', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: ['Queenscrown'],
                hand: ['Now My Watch Begins'],
                gold: 2
            },
            player2: {
                drawDeck: ['Winterfell Steward', 'Ser Gregor Clegane (TKP)', 'Milk of the Poppy']
            }
        });
        this.player1.clickMenu(this.queenscrown, "Reveal top 3 cards of opponent's deck");
    });

    it("can put a character that Queenscrown places in an opponent's discard pile into play", function () {
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickPrompt('Done');

        expect(this.player1).toAllowAbilityTrigger(this.nowMyWatchBegins);

        this.player1.triggerAbility(this.nowMyWatchBegins);
        this.player1.clickPrompt('Done');

        expect(this.winterfellSteward.location).toBe('play area');
        expect(this.winterfellSteward.controller).toBe(this.player1Object);
        expect(this.serGregorClegane.location).toBe('draw deck');
        expect(this.milkOfThePoppy.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be triggered for a character with printed cost higher than 5', function () {
        this.player1.clickCard(this.serGregorClegane);
        this.player1.clickPrompt('Done');

        expect(this.player1).not.toAllowAbilityTrigger(this.nowMyWatchBegins);

        this.player1.clickPrompt('Done');

        expect(this.serGregorClegane.location).toBe('discard pile');
        expect(this.nowMyWatchBegins.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
