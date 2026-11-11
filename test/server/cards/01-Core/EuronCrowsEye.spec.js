describe("Euron Crow's Eye (Core)", function () {
    function setup(context, { player1InPlay = [], player2InPlay = [], player2Deck = [] } = {}) {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: ["Euron Crow's Eye (Core)", ...player1InPlay] },
            player2: { inPlay: player2InPlay, drawDeck: player2Deck }
        });
        context.unopposedChallenge(context.player1, 'Power', context.euronCrowsEye);
    }

    describe('when pillage discards a non-location', function () {
        beforeEach(function () {
            setup(this, { player2Deck: ['Hedge Knight'] });
        });

        it('does not prompt', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.euronCrowsEye);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when pillage discards a location that is not in play', function () {
        beforeEach(function () {
            setup(this, { player2Deck: ['The Arbor'] });
            this.theirArbor = this.player2.findCardByName('The Arbor', 'discard pile');
        });

        it("puts a location from the losing opponent's discard pile into play under your control", function () {
            expect(this.player1).toAllowAbilityTrigger(this.euronCrowsEye);

            this.player1.triggerAbility(this.euronCrowsEye);
            this.player1.clickCard(this.theirArbor);

            expect(this.theirArbor.location).toBe('play area');
            expect(this.theirArbor.controller).toBe(this.player1Object);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the discarded location is already in play for the opponent', function () {
        beforeEach(function () {
            setup(this, { player2InPlay: ['The Arbor'], player2Deck: ['The Arbor'] });
        });

        it('does not prompt', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.euronCrowsEye);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the discarded location is already in play for you', function () {
        beforeEach(function () {
            setup(this, { player1InPlay: ['The Arbor'], player2Deck: ['The Arbor'] });
        });

        it('does not prompt', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.euronCrowsEye);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
