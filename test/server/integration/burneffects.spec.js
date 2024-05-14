describe('burn effects', function () {
    integration(function () {
        describe('when external effects are applied to a card that will be burned', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('baratheon', ['Blood of the Dragon', 'Drogon (Core)']);
                const deck2 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'The Wall (Core)',
                    'Messenger Raven'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.wall = this.player2.findCardByName('The Wall', 'hand');
                this.raven = this.player2.findCardByName('Messenger Raven', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player2);

                this.player2.clickCard(this.wall);
                this.player2.clickCard(this.raven);
            });

            it('should not kill the character', function () {
                expect(this.raven.location).toBe('play area');
            });

            it("should calculate the character's strength correctly", function () {
                // 1 base + 1 from Wall - 1 from Blood of the Dragon = 1
                expect(this.raven.getStrength()).toBe(1);
            });
        });

        describe('when a character with a lasting effect STR buff will be burned', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('tyrell', [
                    'Trading with the Pentoshi',
                    'Hedge Knight',
                    'Varys (Core)',
                    '"Lord Renly\'s Ride"'
                ]);
                const deck2 = this.buildDeck('targaryen', [
                    'A Noble Cause',
                    'Drogon (Core)',
                    'Dracarys!'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Hedge Knight', 'hand');
                this.player1.clickCard(this.character);

                this.dragon = this.player2.findCardByName('Drogon', 'hand');
                this.player2.clickCard(this.dragon);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // Drag Varys to the dead pile to get +3 STR from Lord Renly's Ride
                let deadCharacter = this.player1.findCardByName('Varys', 'hand');
                this.player1.dragCard(deadCharacter, 'dead pile');

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                // Buff the character by +3 STR
                this.player1.clickCard('"Lord Renly\'s Ride"', 'hand');
                this.player1.clickCard(this.character);

                this.player2.clickCard('Dracarys!');
                this.player2.clickCard(this.dragon);
                this.player2.clickCard(this.character);

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Skip claim
                this.player1.clickPrompt('Continue');

                this.completeChallengesPhase();
            });

            it('should not kill the character when lasting effects expire', function () {
                expect(this.character.location).toBe('play area');
            });
        });

        describe('when effects are self-applied to a card that will be burned', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('baratheon', ['Blood of the Dragon', 'Drogon (Core)']);
                const deck2 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'Hedge Knight',
                    'Silent Sisters'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
                this.sisters = this.player2.findCardByName('Silent Sisters', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player2);

                // Move character to dead pile to give Silent Sisters +1 STR.
                this.player2.dragCard(this.knight, 'dead pile');

                this.player2.clickCard(this.sisters);
            });

            it('should not kill the character', function () {
                expect(this.sisters.location).toBe('play area');
            });

            it("should calculate the character's strength correctly", function () {
                // 1 base + 1 from dead pile - 1 from Blood of the Dragon = 1
                expect(this.sisters.getStrength()).toBe(1);
            });
        });

        describe('the strength at which characters die from burn', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('martell', [
                    'A Noble Cause',
                    'A Song of Summer',
                    'Quentyn Martell (WotN)'
                ]);
                const deck2 = this.buildDeck('targaryen', [
                    'A Noble Cause',
                    'Blood of the Dragon',
                    'Drogon (Core)',
                    'Dracarys!',
                    'Astapor',
                    'Targaryen Loyalist',
                    'Braided Warrior',
                    'Viserion (Core)',
                    'Ser Lancel Lannister (LoCR)'
                ]);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.quentyn = this.player1.findCardByName('Quentyn Martell', 'hand');

                this.dragon = this.player2.findCardByName('Drogon', 'hand');
                this.astapor = this.player2.findCardByName('Astapor', 'hand');
                this.str0 = this.player2.findCardByName('Ser Lancel Lannister', 'hand');
                this.str1 = this.player2.findCardByName('Targaryen Loyalist', 'hand');
                this.str2 = this.player2.findCardByName('Viserion', 'hand');
                this.str3 = this.player2.findCardByName('Braided Warrior', 'hand');
                this.str4 = this.dragon;

                this.player1.clickCard(this.quentyn);
                this.player2Object.gold = 20;
                this.player2.clickCard(this.str0);
                this.player2.clickCard(this.str1);
                this.player2.clickCard(this.str2);
                this.player2.clickCard(this.str3);
                this.player2.clickCard(this.str4);

                this.completeSetup();
            });

            describe('normal burn', function () {
                beforeEach(function () {
                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();
                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.quentyn);
                    this.player1.clickPrompt('Done');

                    expect(this.quentyn.getStrength()).toBe(4);

                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard('Dracarys!', 'hand');
                    this.player2.clickCard(this.dragon);
                    this.player2.clickCard(this.quentyn);
                });

                it('should die at STR 0', function () {
                    expect(this.player1).not.toAllowAbilityTrigger('Quentyn Martell');
                });
            });

            describe('multiple burn', function () {
                beforeEach(function () {
                    this.player1.selectPlot('A Song of Summer');
                    this.player2.selectPlot('Blood of the Dragon');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();
                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.quentyn);
                    this.player1.clickPrompt('Done');

                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard('Dracarys!', 'hand');
                    this.player2.clickCard(this.dragon);
                    this.player2.clickCard(this.quentyn);
                });

                it('should die at STR 0', function () {
                    expect(this.player1).not.toAllowAbilityTrigger('Quentyn Martell');
                });
            });

            describe('reduction followed by burn', function () {
                beforeEach(function () {
                    this.player1.selectPlot('A Song of Summer');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.player1.clickPrompt('Done');
                    this.player2.clickCard(this.astapor);
                    this.player2.clickPrompt('2');
                    this.player2.clickPrompt('Done');

                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.quentyn);
                    this.player1.clickPrompt('Done');

                    this.player1.clickPrompt('Pass');
                    this.player2.clickMenu(this.astapor, 'Give character -STR');
                    this.player2.clickCard(this.quentyn);
                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard('Dracarys!', 'hand');
                    this.player2.clickCard(this.dragon);
                    this.player2.clickCard(this.quentyn);
                });

                it('should die at STR 0', function () {
                    expect(this.player1).not.toAllowAbilityTrigger('Quentyn Martell');
                });
            });

            describe('burn followed by reduction', function () {
                beforeEach(function () {
                    this.player1.selectPlot('A Song of Summer');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    this.player1.clickPrompt('Done');
                    this.player2.clickCard(this.astapor);
                    this.player2.clickPrompt('2');
                    this.player2.clickPrompt('Done');

                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.quentyn);
                    this.player1.clickPrompt('Done');

                    this.player1.clickPrompt('Pass');
                    this.player2.clickCard('Dracarys!', 'hand');
                    this.player2.clickCard(this.dragon);
                    this.player2.clickCard(this.quentyn);
                    this.player1.clickPrompt('Pass');
                    this.player2.clickMenu(this.astapor, 'Give character -STR');
                    this.player2.clickCard(this.quentyn);
                });

                it('should die at STR 0', function () {
                    expect(this.player1).not.toAllowAbilityTrigger('Quentyn Martell');
                });
            });
        });
    });
});
