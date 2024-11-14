describe('Red Mountains', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('martell', [
                'Trading with the Pentoshi',
                'Arianne Martell (Core)',
                'Obara Sand (SoD)',
                'Edric Dayne (Core)',
                'Red Mountains'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.redMountains = this.player1.findCardByName('Red Mountains', 'hand');
            this.obara = this.player2.findCardByName('Obara Sand', 'hand');
            this.arianne = this.player2.findCardByName('Arianne Martell', 'hand');
            this.edric = this.player2.findCardByName('Edric Dayne', 'hand');
            this.player1.clickCard(this.redMountains);
            this.player2.clickCard(this.obara);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.player2.clickCard(this.arianne);
            this.completeMarshalPhase();
        });

        describe('when triggered before challenges', function () {
            beforeEach(function () {
                this.player1.clickMenu(this.redMountains, 'Force military challenge');
            });

            it('should prevent the opponent from initiating intrigue or power', function () {
                expect(this.player2).toHaveDisabledPromptButton('Intrigue');
                expect(this.player2).toHaveDisabledPromptButton('Power');
            });

            it('should prevent the opponent from passing challenges', function () {
                expect(this.player2).toHaveDisabledPromptButton('Done');
            });

            describe('and opponent no longer has characters to declare for military', function () {
                beforeEach(function () {
                    this.player2.clickMenu(this.obara, 'Put character into play');
                    this.player2.clickCard(this.obara);
                    this.player2.clickCard(this.edric);
                });

                it('should allow them to initiate intrigue or power', function () {
                    expect(this.player2).not.toHaveDisabledPromptButton('Intrigue');
                    expect(this.player2).not.toHaveDisabledPromptButton('Power');
                });

                it('should allow them to pass challenges', function () {
                    expect(this.player2).not.toHaveDisabledPromptButton('Done');
                });

                describe('and opponent initiates an intrigue challenge', function () {
                    beforeEach(function () {
                        this.unopposedChallenge(this.player2, 'intrigue', this.arianne);
                        this.player2.clickPrompt('Continue');
                        this.player2.clickMenu(this.arianne, 'Put character into play');
                        this.player2.clickCard(this.obara);
                    });

                    it('should allow them to initiate a military or power, but not intrigue', function () {
                        expect(this.player2).not.toHaveDisabledPromptButton('Military');
                        expect(this.player2).toHaveDisabledPromptButton('Intrigue');
                        expect(this.player2).not.toHaveDisabledPromptButton('Power');
                    });

                    it('should allow them to pass challenges', function () {
                        expect(this.player2).not.toHaveDisabledPromptButton('Done');
                    });
                });
            });
        });

        describe('when triggered after a military challenge', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player2, 'military', this.obara);
                this.player1.clickMenu(this.redMountains, 'Force military challenge');
            });

            it('should allow the opponent to initiate intrigue or power', function () {
                expect(this.player2).not.toHaveDisabledPromptButton('Intrigue');
                expect(this.player2).not.toHaveDisabledPromptButton('Power');
            });

            it('should allow the opponent to pass challenges', function () {
                expect(this.player2).not.toHaveDisabledPromptButton('Done');
            });
        });
    });
});
