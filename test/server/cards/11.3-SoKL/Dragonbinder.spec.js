describe('Dragonbinder', function () {
    function setup() {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Hedge Knight', attachments: ['Dragonbinder'] }, 'Ranging Party'],
                drawDeck: ['Theon Greyjoy (Core)'],
                gold: 0
            },
            player2: { inPlay: ['Drogon (Core)'], gold: 0 }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Dragonbinder');
    }

    it('gives the attached character intimidate', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Dragonbinder'] }] }
        });
        expect(this.hedgeKnight.hasKeyword('intimidate')).toBe(true);
    });

    it('kills the attached character after you win dominance to take control of a Dragon character', function () {
        setup.call(this);
        this.player1.clickPrompt('Take control of Dragon');
        this.player1.clickCard(this.drogon);
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.drogon).toBeControlledBy(this.player1);
    });

    it('or to put a Greyjoy character from the top 10 cards of your deck into play', function () {
        setup.call(this);
        this.player1.clickPrompt('Put character into play');
        this.player1.clickCard(this.theonGreyjoy);
        expect(this.theonGreyjoy.location).toBe('play area');
    });
});
