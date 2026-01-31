describe('Into the Lists', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Into the Lists',
                'Randyll Tarly (Core)',
                'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('stark', [
                'A Noble Cause',
                'Eddard Stark (Core)',
                'Bran Stark (Core)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.randyll = this.player1.findCardByName('Randyll Tarly', 'hand');
            this.knight = this.player1.findCardByName('Hedge Knight', 'hand');

            this.eddard = this.player2.findCardByName('Eddard Stark', 'hand');
            this.bran = this.player2.findCardByName('Bran Stark', 'hand');

            this.player1.clickCard(this.randyll);
            this.player1.clickCard(this.knight);

            this.player2.clickCard(this.eddard);
            this.player2.clickCard(this.bran);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when Into the Lists is revealed', function () {
            it('should prompt each player to kneel a character', function () {
                expect(this.player1).toHavePrompt('Select a character to kneel');
            });

            describe('when both players kneel characters with equal STR', function () {
                beforeEach(function () {
                    // Player 1 kneels Randyll (5 STR, Lord)
                    this.player1.clickCard(this.randyll);
                    // Player 2 kneels Eddard (5 STR, Lord)
                    this.player2.clickCard(this.eddard);
                });

                it('should kneel the selected characters', function () {
                    expect(this.randyll.kneeled).toBe(true);
                    expect(this.eddard.kneeled).toBe(true);
                });

                it('should give both tied characters 1 power each', function () {
                    // Both have 5 STR and are Lords (not Knights), so each gets 1 power
                    expect(this.randyll.power).toBe(1);
                    expect(this.eddard.power).toBe(1);
                });
            });

            describe('when a Knight has lower STR than opponent', function () {
                beforeEach(function () {
                    // Player 1 kneels Hedge Knight (2 STR, Knight)
                    this.player1.clickCard(this.knight);
                    // Player 2 kneels Eddard (5 STR, Lord)
                    this.player2.clickCard(this.eddard);
                });

                it('should give power only to the highest STR character', function () {
                    // Eddard has 5 STR, Knight has 2 STR - Eddard wins
                    expect(this.eddard.power).toBe(1);
                    expect(this.knight.power).toBe(0);
                });
            });
        });
    });

    integration(function () {
        describe('when there is a tie for highest STR with Knights', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('tyrell', ['Into the Lists', 'Hedge Knight']);
                const deck2 = this.buildDeck('stark', ['A Noble Cause', 'Hedge Knight']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.knight1 = this.player1.findCardByName('Hedge Knight', 'hand');
                this.knight2 = this.player2.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard(this.knight1);
                this.player2.clickCard(this.knight2);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Both players kneel their Hedge Knight (2 STR each)
                this.player1.clickCard(this.knight1);
                this.player2.clickCard(this.knight2);
            });

            it('should give each Knight 2 power', function () {
                // Both have 2 STR and are Knights, so each gets 2 power
                expect(this.knight1.power).toBe(2);
                expect(this.knight2.power).toBe(2);
            });
        });
    });

    integration(function () {
        describe('when a player has no standing characters', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('tyrell', ['Into the Lists', 'Randyll Tarly (Core)']);
                const deck2 = this.buildDeck('stark', ['A Noble Cause']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.randyll = this.player1.findCardByName('Randyll Tarly', 'hand');

                this.player1.clickCard(this.randyll);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Player 1 kneels Randyll
                this.player1.clickCard(this.randyll);
            });

            it('should still give power to the only knelt character', function () {
                // Randyll (5 STR) is a Lord (not Knight) so gets 1 power
                expect(this.randyll.power).toBe(1);
            });
        });
    });

    integration(function () {
        describe('when a Knight wins outright', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('tyrell', ['Into the Lists', 'Hedge Knight']);
                const deck2 = this.buildDeck('stark', ['A Noble Cause', 'Bran Stark (Core)']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.knight = this.player1.findCardByName('Hedge Knight', 'hand');
                this.bran = this.player2.findCardByName('Bran Stark', 'hand');

                this.player1.clickCard(this.knight);
                this.player2.clickCard(this.bran);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Player 1 kneels Knight (2 STR), Player 2 kneels Bran (1 STR)
                this.player1.clickCard(this.knight);
                this.player2.clickCard(this.bran);
            });

            it('should give the Knight 2 power', function () {
                // Hedge Knight has 2 STR > Bran's 1 STR, and is a Knight, so gets 2 power
                expect(this.knight.power).toBe(2);
                expect(this.bran.power).toBe(0);
            });
        });
    });
});
