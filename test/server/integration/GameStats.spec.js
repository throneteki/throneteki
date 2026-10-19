describe('Game Stats', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('targaryen', [
                'A Noble Cause',
                'Ser Jorah Mormont (Core)',
                'Tumblestone Knight',
                'Waking the Dragon'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.jorah = this.player1.findCardByName('Ser Jorah Mormont', 'hand');
            this.knight = this.player2.findCardByName('Tumblestone Knight', 'hand');

            this.p1Stats = () => this.game.stats.getPlayerStats(this.player1Object);
            this.p2Stats = () => this.game.stats.getPlayerStats(this.player2Object);
        });

        it('should record plots revealed, initiative and income', function () {
            expect(this.p1Stats().cards[this.player1Object.activePlot.code].revealed).toBe(1);
            expect(this.p1Stats().initiativeWon + this.p2Stats().initiativeWon).toBe(1);
            expect(this.p1Stats().goldGained).toBe(this.player1Object.gold);
            expect(this.p1Stats().cardsDrawn).toBe(0);
            expect(this.p1Stats().rounds).toBe(1);
        });

        it('should record cards marshalled by type and per card', function () {
            this.player1.clickCard(this.jorah);

            expect(this.jorah.location).toBe('play area');
            expect(this.p1Stats().cardsMarshalled).toBe(1);
            expect(this.p1Stats().cardsMarshalledByType).toEqual({ character: 1 });
            expect(this.p1Stats().cards[this.jorah.code].marshalled).toBe(1);
            expect(this.p2Stats().cardsMarshalled).toBe(0);
        });

        it('should record events played', function () {
            this.player1.clickCard(this.jorah);
            this.player1.clickCard(this.jorah);
            this.player1.clickCard('Waking the Dragon', 'hand');
            this.player1.clickCard(this.jorah);

            expect(this.jorah.kneeled).toBe(false);
            expect(this.p1Stats().eventsPlayed).toBe(1);
            expect(this.p1Stats().cards['01178'].played).toBe(1);
        });

        describe('when a challenge is won unopposed', function () {
            beforeEach(function () {
                this.player1.clickCard(this.jorah);
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.knight);
                this.player2.clickPrompt('Done');

                this.unopposedChallenge(this.player1, 'Military', this.jorah);
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard(this.knight);
            });

            it('should record the challenge for both players', function () {
                expect(this.p1Stats().challengesInitiated).toEqual({
                    military: 1,
                    intrigue: 0,
                    power: 0
                });
                expect(this.p1Stats().challengesWon.military).toBe(1);
                expect(this.p1Stats().unopposedChallengesWon).toBe(1);
                expect(this.p1Stats().claimsApplied).toBe(1);
                expect(this.p1Stats().cards[this.jorah.code].attacked).toBe(1);
                expect(this.p2Stats().challengesLost.military).toBe(1);
                expect(this.p2Stats().challengesInitiated.military).toBe(0);
            });

            it('should record power gained from renown and unopposed', function () {
                expect(this.jorah.power).toBe(1);
                expect(this.player1Object.faction.power).toBe(1);
                expect(this.p1Stats().powerGained).toBe(2);
                expect(this.p1Stats().powerFromRenown).toBe(1);
            });

            it('should record characters killed by claim', function () {
                expect(this.knight.location).toBe('dead pile');
                expect(this.p2Stats().charactersKilled).toBe(1);
                expect(this.p2Stats().cards[this.knight.code].killed).toBe(1);
                expect(this.p1Stats().charactersKilled).toBe(0);
            });
        });

        it('should record the dominance winner', function () {
            this.player1.clickCard(this.jorah);
            this.completeMarshalPhase();
            this.completeChallengesPhase();

            expect(this.p1Stats().dominanceWon).toBe(1);
            expect(this.p2Stats().dominanceWon).toBe(0);
        });

        it('should include stats in the saved game state', function () {
            this.player1.clickCard(this.jorah);

            const saved = this.game
                .getSaveState()
                .players.find((player) => player.name === this.player1Object.name);

            expect(saved.stats.cardsMarshalled).toBe(1);
            expect(saved.stats.rounds).toBe(this.game.round);
        });

        it('should stop recording once the game is over', function () {
            this.game.concede(this.player2Object.name);
            this.player1.clickCard(this.jorah);

            expect(this.game.isGameOver).toBe(true);
            expect(this.p1Stats().cardsMarshalled).toBe(0);
        });
    });
});
