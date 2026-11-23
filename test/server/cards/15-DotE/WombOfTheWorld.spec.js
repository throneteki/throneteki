describe('Womb of the World (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Womb of the World (DotE)'],
                drawDeck: ['Devoted Bloodrider', 'Hedge Knight']
            }
        });
        this.player1.clickMenu(this.wombOfTheWorld, 'Reveal top 5 cards');
    });

    it('puts a revealed Dothraki character into play, and returns it to hand at the end of the phase', function () {
        expect(this.player1).not.toAllowSelect(this.hedgeKnight);
        this.player1.clickCard(this.devotedBloodrider);
        expect(this.devotedBloodrider.location).toBe('play area');
        this.completeChallengesPhase();
        expect(this.devotedBloodrider.location).toBe('hand');
    });

    it('may put none into play', function () {
        this.player1.clickPrompt('Done');
        expect(this.devotedBloodrider.location).toBe('draw deck');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Womb of the World (DotE) when Sweetrobin removes a revealed character', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'Sneak Attack',
                inPlay: ['Womb of the World (DotE)', 'Sweetrobin'],
                drawDeck: ['Devoted Bloodrider', 'Aggo', 'Hedge Knight']
            }
        });
        this.player1.clickMenu(this.wombOfTheWorld, 'Reveal top 5 cards');
        this.player1.triggerAbility(this.sweetrobin);
        this.player1.clickCard(this.devotedBloodrider);
    });

    it('can put another revealed Dothraki character into play', function () {
        expect(this.devotedBloodrider.location).toBe('out of game');
        expect(this.player1).toBeAbleToSelect(this.aggo);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.aggo);
        expect(this.aggo.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
