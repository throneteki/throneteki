describe('assault', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('greyjoy', [
                'Trading with the Pentoshi',
                'The Iron Fleet',
                'Dagmer Cleftjaw (TS)',
                'Thenns',
                'Foamdrinker'
            ]);
            const deck2 = this.buildDeck('thenightswatch', [
                'Trading with the Pentoshi',
                'Great Ranging',
                'Old Forest Hunter',
                'The Wall (Core)',
                'Queenscrown',
                'Nightmares',
                'Fist of the First Men'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.ironFleet = this.player1.findCardByName('The Iron Fleet', 'hand');
            this.dagmer = this.player1.findCardByName('Dagmer Cleftjaw', 'hand');
            this.thenns = this.player1.findCardByName('Thenns', 'hand');
            this.foamdrinker = this.player1.findCardByName('Foamdrinker', 'hand');
            this.greatRanging = this.player2.findCardByName('Great Ranging', 'hand');
            this.hunter = this.player2.findCardByName('Old Forest Hunter', 'hand');
            this.wall = this.player2.findCardByName('The Wall', 'hand');
            this.nightmares = this.player2.findCardByName('Nightmares', 'hand');
            this.fist = this.player2.findCardByName('Fist of the First Men', 'hand');

            this.player1.clickCard(this.ironFleet);
            this.player2.clickCard(this.wall);
            this.player2.clickCard(this.hunter);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            // Resolve plot order
            this.selectPlotOrder(this.player1);

            this.player1.clickCard(this.dagmer);
            this.player1.clickCard(this.thenns);
            this.player1.clickPrompt('Done');

            this.player2.clickCard(this.greatRanging);
            this.player2.clickCard(this.fist);
            this.player2.clickPrompt('Done');
        });

        describe('when a lower costing character with assault is declared as an attacker', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.thenns);
                this.player1.clickPrompt('Done');
            });

            it('should prompt to only choose a location with a lower printed cost', function () {
                expect(this.player1).toHavePrompt('Select assault target for Thenns');
                expect(this.player1).toAllowSelect(this.fist);
                expect(this.player1).not.toAllowSelect(this.wall);
            });
        });

        describe('when a single attacking character assaults a location', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.ironFleet);
                this.player1.clickPrompt('Done');

                this.player1.clickCard(this.wall);
            });

            it('should immediately blank that location', function () {
                // With The Wall blanked, it should be 7 STR + 1 STR from Fist of the First Men
                expect(this.greatRanging.getStrength()).toBe(8);
            });

            describe('and the attacker loses the challenge', function () {
                beforeEach(function () {
                    this.skipActionWindow();

                    // Attacker loses with 8 STR vs 10 STR
                    this.player2.clickCard(this.greatRanging);
                    this.player2.clickCard(this.hunter);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                });

                it('should not kneel the location', function () {
                    expect(this.wall.kneeled).toBe(false);
                });

                it('should un-blank the location once the challenge is fully resolved', function () {
                    expect(this.greatRanging.getStrength()).toBe(9);
                });
            });

            describe('and the attacker wins the challenge', function () {
                beforeEach(function () {
                    this.skipActionWindow();

                    // Attacker wins with 8 STR vs 2 STR
                    this.player2.clickCard(this.hunter);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                });

                it('should immediately kneel the location', function () {
                    expect(this.wall.kneeled).toBe(true);
                });

                it('should un-blank the location once the challenge is fully resolved', function () {
                    // With The Wall blanked, it should be 7 STR + 1 STR from Fist of the First Men
                    expect(this.greatRanging.getStrength()).toBe(8);

                    this.player1.clickPrompt('Apply Claim');
                    this.player2.clickCard(this.hunter);

                    expect(this.greatRanging.getStrength()).toBe(9);
                });
            });
        });

        describe('when multiple attacking characters have assault', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.ironFleet);
                this.player1.clickCard(this.thenns);
                this.player1.clickPrompt('Done');
            });

            it('should prompt to choose a location with a lower printed cost to the highest cost attacker with assault', function () {
                expect(this.player1).toHavePrompt('Select assault target for The Iron Fleet');
                expect(this.player1).toAllowSelect(this.fist);
                expect(this.player1).toAllowSelect(this.wall);
            });

            describe('and the initial assaulting character loses assault', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.wall);

                    this.player1.clickPrompt('Pass');

                    // Iron Fleet losing assault
                    this.player2.clickCard('Nightmares');
                    this.player2.clickCard(this.ironFleet);

                    this.skipActionWindow();
                });

                it('should continue blanking the location', function () {
                    expect(this.greatRanging.getStrength()).toBe(8);
                });

                it('should immediately kneel the location after winning the challenge', function () {
                    // Attacker wins with 8 STR vs 2 STR
                    this.player2.clickCard(this.hunter);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    expect(this.wall.kneeled).toBe(true);
                });
            });
        });

        describe('when an attacking character assaults a location, but during the challenge it loses assault', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.ironFleet);
                this.player1.clickCard(this.dagmer);
                this.player1.clickPrompt('Done');

                this.player1.clickCard(this.wall);

                this.player1.clickPrompt('Pass');

                // Iron Fleet losing assault
                this.player2.clickCard('Nightmares');
                this.player2.clickCard(this.ironFleet);
            });

            it('should not kneel the location after winning the challenge', function () {
                this.skipActionWindow();

                // Attacker wins with 8 STR vs 2 STR
                this.player2.clickCard(this.hunter);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                expect(this.wall.kneeled).toBe(false);
            });

            describe('and another attacker gains assault', function () {
                beforeEach(function () {
                    // Dagmer gaining assault
                    this.player1.dragCard(this.foamdrinker, 'play area');

                    this.skipActionWindow();
                });

                it('should immediately kneel the location after winning the challenge', function () {
                    // Attacker wins with 8 STR vs 2 STR
                    this.player2.clickCard(this.hunter);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    expect(this.wall.kneeled).toBe(true);
                });
            });
        });
    });
});
