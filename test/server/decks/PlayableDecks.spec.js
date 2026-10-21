// Published ThronesDB lists whose mirror match starts with manual mode off.
const Decks = [
    {
        name: 'Stark Fealty, "Characters"',
        url: 'https://thronesdb.com/decklist/view/16711',
        plot: 'Time of Plenty',
        cards: {
            '01027': 1,
            13020: 1,
            '01015': 1,
            '01016': 1,
            '02039': 1,
            '05051': 2,
            '06020': 1,
            13001: 3,
            13041: 3,
            17124: 3,
            25031: 3,
            '01039': 3,
            '01040': 3,
            '01141': 3,
            '01142': 3,
            '01143': 3,
            '01145': 3,
            '01147': 3,
            '01148': 2,
            '01149': 3,
            '01150': 3,
            '01156': 3,
            '03006': 3,
            '04002': 3,
            '06061': 3,
            '08021': 3,
            '08038': 1,
            '08061': 3
        }
    },
    {
        name: 'Stark Fealty, "8 Regents 2025 - Stark Fealty (aggro)"',
        url: 'https://thronesdb.com/decklist/view/16272',
        plot: 'A Storm of Swords',
        cards: {
            '01027': 1,
            '01005': 2,
            '01015': 1,
            '06020': 1,
            '08020': 1,
            '08120': 1,
            20056: 1,
            10033: 3,
            11003: 3,
            11041: 3,
            13001: 3,
            13002: 3,
            14033: 3,
            17123: 2,
            17124: 3,
            24018: 2,
            '01039': 3,
            '01041': 2,
            '01141': 3,
            '01142': 2,
            '01145': 3,
            '01148': 2,
            '01152': 3,
            '01153': 2,
            '01156': 3,
            '01159': 3,
            '04002': 3,
            '04062': 2,
            '06061': 3,
            '08041': 1
        }
    }
];

for (const deckList of Decks) {
    describe(`${deckList.name} mirror`, function () {
        integration({ gameOptions: { manualMode: 'auto' } }, function () {
            beforeEach(function () {
                const deck = this.buildDeck(
                    'stark',
                    Object.entries(deckList.cards).map(([code, count]) => ({ name: code, count }))
                );

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();
            });

            it('is a legal 60-card, 7-plot deck', function () {
                for (const player of [this.player1Object, this.player2Object]) {
                    expect(player.preparedDeck.drawCards).toHaveLength(60);
                    expect(player.preparedDeck.plotCards).toHaveLength(7);
                }
            });

            it('starts with manual mode off', function () {
                expect(this.game.manualMode.enabled).toBe(false);
                expect(this.game.getPlainTextLog()).toContain(
                    'Every card in this game is verified, so manual mode is off'
                );
            });

            it('plays a round without manual mode', function () {
                this.completeSetup();
                this.player1.selectPlot(deckList.plot);
                this.player2.selectPlot(deckList.plot);
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                expect(this.game.currentPhase).not.toBe('challenge');
                expect(this.game.manualMode.enabled).toBe(false);
                expect(this.game.getPlainTextLog()).not.toContain('while manual mode is off');
            });
        });
    });
}
