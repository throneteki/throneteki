describe('Randyll Tarly (JS)', function () {
    function setup(drawDeck) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Randyll Tarly (JS)',
                    'Rose Garden',
                    { card: 'Ranging Party', kneeling: true }
                ],
                drawDeck
            }
        });
        this.player1.clickMenu(this.randyllTarly, 'Stand Army or reveal top card');
        this.player1.clickCard(this.roseGarden);
    }

    it('kneels a The Reach location to stand an Army character', function () {
        setup.call(this, []);
        this.player1.clickPrompt('Stand an Army');
        this.player1.clickCard(this.rangingParty);
        expect(this.roseGarden.kneeled).toBe(true);
        expect(this.rangingParty.kneeled).toBe(false);
    });

    it('or reveals the top card of your deck and draws it if it is a location', function () {
        setup.call(this, ['The Roseroad']);
        this.player1.clickPrompt('Reveal top card');
        expect(this.theRoseroad.location).toBe('hand');
    });

    it('puts it into play instead if it is a The Reach location', function () {
        setup.call(this, ['The Mander']);
        this.player1.clickPrompt('Reveal top card');
        expect(this.theMander.location).toBe('play area');
    });
});
