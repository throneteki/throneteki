describe('Stannis Baratheon', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('baratheon', [
                'Trading with the Pentoshi',
                'Stannis Baratheon (Core)',
                'Robert Baratheon (Core)',
                'Dragonstone Faithful',
                'Maester Cressen (Core)',
                'The Roseroad',
                'Bodyguard',
                'Recruiter for the Watch'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.character1 = this.player1.findCardByName('Robert Baratheon', 'hand');
            this.character2 = this.player1.findCardByName('Dragonstone Faithful', 'hand');
            this.character3 = this.player1.findCardByName('Maester Cressen', 'hand');
            this.attachment = this.player1.findCardByName('Bodyguard', 'hand');
            this.location = this.player1.findCardByName('The Roseroad', 'hand');

            this.player1.clickCard(this.character1);
            this.player1.clickCard(this.attachment);
            this.player1.clickCard(this.location);
            this.player2.clickCard('Stannis Baratheon', 'hand');
            this.completeSetup();

            // Attach Bodyguard.
            this.player1.clickCard(this.attachment);
            this.player1.clickCard(this.character1);

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickCard(this.character2);
            this.player1.clickCard(this.character3);

            // Manually kneel everything
            this.player1.clickCard(this.character1);
            this.player1.clickCard(this.location);
            this.player1.clickCard(this.attachment);
        });

        describe('when there are 2 or fewer characters are kneeling', function () {
            beforeEach(function () {
                this.player1.clickCard(this.character2);

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.completeChallengesPhase();
            });

            it('should automatically stand all characters', function () {
                expect(this.character1.kneeled).toBe(false);
                expect(this.character2.kneeled).toBe(false);
                expect(this.location.kneeled).toBe(false);
                expect(this.attachment.kneeled).toBe(false);
            });
        });

        describe('when there are more than 2 characters kneeling', function () {
            beforeEach(function () {
                this.player1.clickCard(this.character2);
                this.player1.clickCard(this.character3);

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                this.completeChallengesPhase();
            });

            it('should prompt to stand characters', function () {
                expect(this.player1).toHavePrompt('Select 2 cards to stand');
            });

            it('should require 2 cards be selected', function () {
                this.player1.clickCard(this.character1);
                this.player1.clickPrompt('Done');

                expect(this.player1).toHavePrompt('Select 2 cards to stand');
            });

            describe('when cards are selected', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.character1);
                    this.player1.clickCard(this.character3);
                    this.player1.clickPrompt('Done');
                });

                it('should stand only selected characters', function () {
                    expect(this.character1.kneeled).toBe(false);
                    expect(this.character3.kneeled).toBe(false);
                    expect(this.character2.kneeled).toBe(true);
                });

                it('should automatically stand non-characters', function () {
                    expect(this.location.kneeled).toBe(false);
                    expect(this.attachment.kneeled).toBe(false);
                });
            });
        });

        describe('when Recruiter for the Watch is out', function () {
            beforeEach(function () {
                this.recruiter = this.player1.findCardByName('Recruiter for the Watch', 'hand');

                this.player1.clickCard(this.recruiter);

                // Kneel Recruiter
                this.player1.clickCard(this.recruiter);
            });

            describe('and there are 2 or fewer kneeling cards', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Done');

                    this.completeChallengesPhase();
                });

                it('should prompt to stand the Recruiter', function () {
                    expect(this.player1).toHavePrompt('Select optional cards to stand');
                });
            });

            describe('and there are more than 2 kneeling cards', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.character2);

                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Done');

                    this.completeChallengesPhase();
                });

                it('should prompt to stand 2 characters', function () {
                    expect(this.player1).toHavePrompt('Select 2 cards to stand');
                });

                it('should not prompt for Recruiter when it is selected', function () {
                    this.player1.clickCard(this.character1);
                    this.player1.clickCard(this.recruiter);
                    this.player1.clickPrompt('Done');

                    expect(this.player1).not.toHavePrompt('Select optional cards to stand');
                    expect(this.character1.kneeled).toBe(false);
                    expect(this.recruiter.kneeled).toBe(false);
                });

                it('should not prompt for Recruiter when it is not selected', function () {
                    this.player1.clickCard(this.character1);
                    this.player1.clickCard(this.character2);
                    this.player1.clickPrompt('Done');

                    expect(this.player1).not.toHavePrompt('Select optional cards to stand');
                    expect(this.character1.kneeled).toBe(false);
                    expect(this.character2.kneeled).toBe(false);
                    expect(this.recruiter.kneeled).toBe(true);
                });
            });
        });
    });
});
