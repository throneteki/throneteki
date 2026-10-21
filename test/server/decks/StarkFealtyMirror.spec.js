// Stark Fealty, "Characters": https://thronesdb.com/decklist/view/16711
const StarkFealty = {
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
};

describe('Stark Fealty mirror', function () {
    integration({ gameOptions: { manualMode: 'auto' } }, function () {
        beforeEach(function () {
            const cards = Object.entries(StarkFealty).map(([code, count]) => ({
                name: code,
                count
            }));
            const deck = this.buildDeck('stark', cards);

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
            this.player1.selectPlot('Time of Plenty');
            this.player2.selectPlot('Time of Plenty');
            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
            this.completeChallengesPhase();

            expect(this.game.currentPhase).not.toBe('challenge');
            expect(this.game.manualMode.enabled).toBe(false);
            expect(this.game.getPlainTextLog()).not.toContain('while manual mode is off');
        });
    });
});
