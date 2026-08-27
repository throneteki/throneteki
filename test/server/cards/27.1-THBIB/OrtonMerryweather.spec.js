describe('Orton Merryweather', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Orton Merryweather (THBIB)',
                'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('tyrell', ['A Noble Cause', 'Margaery Tyrell (Core)']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.orton = this.player1.findCardByName('Orton Merryweather', 'hand');
            this.p2margaery = this.player2.findCardByName('Margaery Tyrell', 'hand');

            this.player1.clickCard(this.orton);
            this.player2.clickCard(this.p2margaery);
            this.completeSetup();
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe("the additional gold passive's contribution to dominance", function () {
            it('should count each gold twice towards dominance (once from the pool, once from the passive)', function () {
                this.player1Object.gold = 0;
                this.game.refreshGameState();
                this.game.continue();
                const baseDominance = this.player1Object.getDominance();

                this.player1Object.gold = 3;
                this.game.refreshGameState();
                this.game.continue();

                expect(this.player1Object.getDominance()).toBe(baseDominance + 6);
            });
        });

        describe('when the interrupt gains gold before dominance is calculated', function () {
            beforeEach(function () {
                // Without the interrupt: player1 = Orton's 4 STR; player2 = Margaery's 3 STR
                // + 2 gold = 5, so player2 wins. With it, player1 gains 2 gold, worth +4
                // dominance via the additional gold passive (2 from the pool, 2 more from
                // the passive), taking player1 to 8 and flipping the result.
                this.player1Object.gold = 0;
                this.player2Object.gold = 2;
                this.game.refreshGameState();
                this.game.continue();

                this.completeChallengesPhase();
                this.player1.triggerAbility(this.orton);
            });

            it('should contribute to the dominance total it was gained for, flipping the winner to player1', function () {
                expect(this.game.winnerOfDominanceInLastRound).toBe(this.player1Object);
            });
        });
    });
});
