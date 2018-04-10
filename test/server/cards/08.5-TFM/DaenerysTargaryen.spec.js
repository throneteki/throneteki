describe('Daenerys Targaryen (TFM)', function() {
    integration({ numOfPlayers: 1 }, function() {
        beforeEach(function() {
            const deck = this.buildDeck('targaryen', [
                'Trading with the Pentoshi', 'Blood of the Dragon',
                'Daenerys Targaryen (TFM)', 'Waking the Dragon', 'Winterfell Steward',
                'Nightmares', 'A Dragon Is No Slave', 'A Dragon Is No Slave'
            ]);
            this.player1.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.dany = this.player1.findCardByName('Daenerys Targaryen (TFM)', 'hand');
            this.steward = this.player1.findCardByName('Winterfell Steward', 'hand');
            this.waking = this.player1.findCardByName('Waking the Dragon', 'hand');
            this.nightmares = this.player1.findCardByName('Nightmares', 'hand');
            [this.noSlave1, this.noSlave2] = this.player1.filterCardsByName('A Dragon Is No Slave', 'hand');

            this.player1.clickCard(this.dany);
            this.player1.clickCard(this.steward);

            this.completeSetup();
        });

        describe('when a constant effect burns Daenerys Targaryen (TFM)', function() {
            beforeEach(function() {
                this.player1.selectPlot('Blood of the Dragon');
                this.selectFirstPlayer(this.player1);
            });

            it('should not lower her strength', function() {
                expect(this.dany.getStrength()).toBe(3);
            });
        });

        describe('when you burn a STR 1 chud', function() {
            beforeEach(function() {
                this.player1.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);
    
                this.completeMarshalPhase();

                this.player1.clickCard(this.waking);
                this.player1.clickCard(this.dany);

                this.player1.clickPrompt('Daenerys Targaryen');
                this.player1.clickCard(this.steward);
            });

            it('should be killed', function() {
                expect(this.steward.location).toBe('dead pile');
            });
        });

        describe('when a triggered ability burns Daenerys Targaryen (TFM)', function() {
            beforeEach(function() {
                this.player1.selectPlot('Trading with the Pentoshi');
                this.selectFirstPlayer(this.player1);
    
                this.completeMarshalPhase();

                this.player1.clickCard(this.waking);
                this.player1.clickCard(this.dany);

                this.player1.clickPrompt('Daenerys Targaryen');
                this.player1.clickCard(this.dany);
            });

            it('should not reduce her strength', function() {
                expect(this.dany.getStrength()).toBe(3);
            });

            describe('but when you blank her afterwards, and then reduce her strength non-terminally', function() {
                beforeEach(function() {
                    this.player1.clickCard(this.nightmares);
                    this.player1.clickCard(this.dany);

                    this.player1.clickCard(this.noSlave1);
                    this.player1.clickCard(this.dany);
                });

                it('should lower her strength', function() {
                    expect(this.dany.getStrength()).toBe(1);
                });

                describe('and when it reaches 0', function() {
                    beforeEach(function() {
                        this.player1.clickCard(this.noSlave2);
                        this.player1.clickCard(this.dany);
                    });

                    it('should kill her', function() {
                        expect(this.dany.location).toBe('dead pile');
                    });
                });
            });
        });
    });
});
