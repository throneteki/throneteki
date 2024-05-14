describe("Varys's Riddle", function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', ["Varys's Riddle", 'The Roseroad']);

            this.player1.selectDeck(deck1);
        });

        describe('when there are plot modifiers out', function () {
            beforeEach(function () {
                const deck2 = this.buildDeck('lannister', ['Wildfire Assault']);

                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('The Roseroad', 'hand');
                this.completeSetup();
            });

            it('should not crash', function () {
                expect(() => {
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);
                }).not.toThrow();
            });
        });

        describe('when played against Wraiths in Their Midst', function () {
            beforeEach(function () {
                const deck2 = this.buildDeck('lannister', ['Wraiths in Their Midst']);

                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();
                this.completeSetup();

                this.varysRiddle = this.player1.findCardByName("Varys's Riddle");

                this.selectFirstPlayer(this.player1);
            });

            it("should reduce Varys's Riddle by the proper amount", function () {
                // Reduce 7 by 2 from Wraiths
                expect(this.varysRiddle.getReserve()).toBe(5);
            });
        });

        describe('when played against Calm Over Westeros', function () {
            integration(function () {
                beforeEach(function () {
                    const deck1 = this.buildDeck('lannister', ["Varys's Riddle", 'Hedge Knight']);
                    const deck2 = this.buildDeck('lannister', [
                        '"The Rains of Castamere"',
                        'Calm Over Westeros',
                        'Power Behind the Throne',
                        'The Tickler',
                        'Ser Jaime Lannister (Core)'
                    ]);
                    this.player1.selectDeck(deck1);
                    this.player2.selectDeck(deck2);
                    this.startGame();
                    this.keepStartingHands();

                    this.player2.clickCard('Ser Jaime Lannister', 'hand');

                    this.completeSetup();

                    this.powerBehindTheThrone =
                        this.player2.findCardByName('Power Behind the Throne');

                    this.selectFirstPlayer(this.player2);

                    this.selectPlotOrder(this.player1);

                    // Reduce Intrigue claim using Varys's Riddle
                    this.player1.clickPrompt('Intrigue');

                    // Reduce claim on Military this round.
                    this.player2.clickPrompt('Military');

                    // Marshal cards
                    this.player2.clickCard('The Tickler', 'hand');
                    this.completeMarshalPhase();
                });

                describe('on a normal challenge', function () {
                    beforeEach(function () {
                        this.unopposedChallenge(this.player2, 'Intrigue', 'The Tickler');
                        this.player2.clickPrompt('Apply Claim');
                    });

                    it('should reduce the claim', function () {
                        expect(this.player1Object.discardPile.length).toBe(0);
                    });
                });

                describe('when Calm is replaced using Rains', function () {
                    beforeEach(function () {
                        this.unopposedChallenge(this.player2, 'Intrigue', 'Ser Jaime Lannister');
                        this.player2.triggerAbility('"The Rains of Castamere"');
                        this.player2.clickCard(this.powerBehindTheThrone);
                        this.player2.clickPrompt('Apply Claim');
                    });

                    it('should reduce the claim', function () {
                        expect(this.player1Object.discardPile.length).toBe(0);
                    });
                });
            });
        });

        describe('when played against something that reacts to plots being revealed', function () {
            beforeEach(function () {
                const deck2 = this.buildDeck('stark', ['Trading with the Pentoshi', 'Old Nan']);

                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();
                this.player2.clickCard('Old Nan', 'hand');
                this.completeSetup();

                expect(this.player2).toAllowAbilityTrigger('Old Nan');
                this.player2.clickPrompt('Pass');

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);
            });

            it('should not trigger plot reveal interrupts / reactions', function () {
                expect(this.player2).not.toAllowAbilityTrigger('Old Nan');
            });
        });
    });
});
