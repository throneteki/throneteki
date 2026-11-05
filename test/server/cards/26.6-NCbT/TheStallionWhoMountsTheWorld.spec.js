describe('The Stallion Who Mounts the World', function () {
    function setup(defenders) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Courtesan of the Rose'],
                hand: ['The Stallion Who Mounts the World'],
                drawDeck: ['Devoted Bloodrider'],
                gold: 5
            },
            player2: { inPlay: defenders }
        });
        this.unopposedChallenge(this.player1, 'Power', this.courtesanOfTheRose);
        this.player1.triggerAbility('The Stallion Who Mounts the World');
    }

    it('kneels your faction card to put a Dothraki character from your deck into play after you win a power challenge attacking', function () {
        setup.call(this, ['Hedge Knight']);
        this.player1.clickCard(this.devotedBloodrider);
        expect(this.player1Object.faction.kneeled).toBe(true);
        expect(this.devotedBloodrider.location).toBe('play area');
    });

    it('lets the defending player kill 2 characters to cancel it', function () {
        setup.call(this, ['Hedge Knight', 'Castle Guard']);
        this.player2.clickPrompt('Kill 2 characters');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.player2.clickPrompt('Done');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.castleGuard.location).toBe('dead pile');
        expect(this.devotedBloodrider.location).toBe('draw deck');
    });

    it('lets them allow the search instead', function () {
        setup.call(this, ['Hedge Knight', 'Castle Guard']);
        this.player2.clickPrompt('Allow search');
        this.player1.clickCard(this.devotedBloodrider);
        expect(this.devotedBloodrider.location).toBe('play area');
    });
});
