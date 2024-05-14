describe('Daenerys Targaryen (TFM)', function () {
    integration({ numOfPlayers: 1 }, function () {
        beforeEach(function () {
            const deck = this.buildDeck('targaryen', [
                'Trading with the Pentoshi',
                'Blood of the Dragon',
                'Daenerys Targaryen (TFM)',
                'Waking the Dragon',
                'Winterfell Steward',
                'Nightmares',
                'A Dragon Is No Slave',
                'A Dragon Is No Slave'
            ]);
            this.player1.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.dany = this.player1.findCardByName('Daenerys Targaryen (TFM)', 'hand');
            this.steward = this.player1.findCardByName('Winterfell Steward', 'hand');
            this.waking = this.player1.findCardByName('Waking the Dragon', 'hand');
            this.nightmares = this.player1.findCardByName('Nightmares', 'hand');
            [this.noSlave1, this.noSlave2] = this.player1.filterCardsByName(
                'A Dragon Is No Slave',
                'hand'
            );

            this.player1.clickCard(this.dany);
            this.player1.clickCard(this.steward);

            this.completeSetup();
        });

        describe('when a constant effect burns Daenerys Targaryen (TFM)', function () {
            beforeEach(function () {
                this.player1.selectPlot('Blood of the Dragon');
                this.selectFirstPlayer(this.player1);
            });

            it('should not lower her strength', function () {
                expect(this.dany.getStrength()).toBe(3);
            });
        });

        describe('when you burn a STR 1 chud', function () {
            beforeEach(function () {
                this.player1.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickCard(this.waking);
                this.player1.clickCard(this.dany);

                this.player1.triggerAbility('Daenerys Targaryen');
                this.player1.clickCard(this.steward);
            });

            it('should be killed', function () {
                expect(this.steward.location).toBe('dead pile');
            });
        });

        describe('when a triggered ability burns Daenerys Targaryen (TFM)', function () {
            beforeEach(function () {
                this.player1.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickCard(this.waking);
                this.player1.clickCard(this.dany);

                this.player1.triggerAbility('Daenerys Targaryen');
                this.player1.clickCard(this.dany);
            });

            it('should not reduce her strength', function () {
                expect(this.dany.getStrength()).toBe(3);
            });

            describe('but when you blank her afterwards, and then reduce her strength non-terminally', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.nightmares);
                    this.player1.clickCard(this.dany);
                });

                it('should lower her strength', function () {
                    // The previous lasting effect from Dany's ability now applies.
                    expect(this.dany.getStrength()).toBe(2);
                });

                describe('and when it reaches 0', function () {
                    beforeEach(function () {
                        this.player1.clickCard(this.noSlave2);
                        this.player1.clickCard(this.dany);
                    });

                    it('should kill her', function () {
                        expect(this.dany.location).toBe('dead pile');
                    });
                });
            });
        });
    });

    integration({ numOfPlayers: 1 }, function () {
        describe('vs Lord of the Crossing', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'The Lord of the Crossing',
                    'Trading with the Pentoshi',
                    'Daenerys Targaryen (TFM)',
                    'Viserion (Core)',
                    'Viserys Targaryen (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.dany = this.player1.findCardByName('Daenerys Targaryen (TFM)', 'hand');
                this.player1.clickCard(this.dany);
                this.player1.clickCard('Viserion', 'hand');
                this.player1.clickCard('Viserys Targaryen', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            describe('during the first challenge', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard(this.dany);
                    this.player1.clickPrompt('Done');
                });

                it('should not reduce her strength', function () {
                    expect(this.dany.getStrength()).toBe(3);
                });
            });

            describe('during the third challenge', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Military');
                    this.player1.clickCard('Viserion');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.skipActionWindow();

                    this.player1.clickPrompt('Power');
                    this.player1.clickCard('Viserys Targaryen');
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.skipActionWindow();

                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard(this.dany);
                    this.player1.clickPrompt('Done');
                });

                it('should increase her strength', function () {
                    expect(this.dany.getStrength()).toBe(5);
                });
            });
        });
    });

    integration({ numOfPlayers: 1 }, function () {
        describe('vs Strangler', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'Trading with the Pentoshi',
                    'Daenerys Targaryen (TFM)',
                    'Strangler'
                ]);
                this.player1.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.dany = this.player1.findCardByName('Daenerys Targaryen (TFM)', 'hand');
                let strangler = this.player1.findCardByName('Strangler', 'hand');
                this.player1.clickCard(this.dany);
                this.player1.clickCard(strangler);

                this.completeSetup();
                this.player1.clickCard(strangler);
                this.player1.clickCard(this.dany);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.dany);
                this.player1.clickPrompt('Done');
            });

            it('should not set her strength to 1', function () {
                // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/39646-ruling-daenerys-targaryen-tfm-strangler/
                expect(this.dany.getStrength()).toBe(3);
            });
        });
    });
});
