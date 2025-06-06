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

        describe('burn vs dynamic strength', function () {
            beforeEach(function () {
                let stark = this.buildDeck('stark', [
                    'Dacey Mormont',
                    'Tumblestone Knight',
                    'A Noble Cause'
                ]);
                let targ = this.buildDeck('targaryen', [
                    'Braided Warrior',
                    'Nightmares',
                    'Blood of the Dragon'
                ]);

                this.player1.selectDeck(stark);
                this.player2.selectDeck(targ);

                this.startGame();
                this.keepStartingHands();

                this.dacey = this.player1.findCardByName('Dacey Mormont', 'hand');
                this.knight = this.player1.findCardByName('Tumblestone Knight', 'hand');

                this.warrior = this.player2.findCardByName('Braided Warrior', 'hand');
                this.nightmares = this.player2.findCardByName('Nightmares', 'hand');

                this.player1.clickCard(this.dacey);
                this.player1.clickCard(this.knight);

                this.player2.clickCard(this.warrior);

                this.completeSetup();
                this.selectFirstPlayer(this.player2);
                this.completeMarshalPhase();
            });

            it('should kill when the strength is reduced to 0 due to the dynamic condition changing', function () {
                this.unopposedChallenge(this.player2, 'military', this.warrior);
                expect(this.dacey.getStrength()).toBe(1);
                this.player2.clickPrompt('Apply Claim');
                this.player1.clickCard(this.knight);
                expect(this.dacey.location).toBe('dead pile');
            });

            it('should kill when the strength is reduced to 0 due to the dynamic card being blanked', function () {
                this.player2.clickCard(this.nightmares);
                this.player2.clickCard(this.dacey);
                expect(this.dacey.location).toBe('dead pile');
            });
        });

        describe('burn vs withdrawal of strength effects', function () {
            beforeEach(function () {
                let stark = this.buildDeck('stark', [
                    'Ser Edmure Tully',
                    'Ice (Core)',
                    'Strangler',
                    'A Noble Cause'
                ]);
                let targ = this.buildDeck('targaryen', [
                    'Drogon (Core)',
                    'Dracarys!',
                    'A Noble Cause',
                    'Shadow of the East'
                ]);

                this.player1.selectDeck(stark);
                this.player2.selectDeck(targ);

                this.startGame();
                this.keepStartingHands();

                this.edmure = this.player1.findCardByName('Ser Edmure Tully', 'hand');
                this.ice = this.player1.findCardByName('Ice (Core)', 'hand');
                this.strangler = this.player1.findCardByName('Strangler', 'hand');

                this.drogon = this.player2.findCardByName('Drogon (Core)', 'hand');
                this.dracarys = this.player2.findCardByName('Dracarys!', 'hand');
                this.shadow = this.player2.findCardByName('Shadow of the East', 'hand');

                this.player1.clickCard(this.edmure);
                this.player2.clickCard(this.drogon);
                this.player2.clickCard(this.shadow);

                this.completeSetup();
                this.selectFirstPlayer(this.player1);
            });

            it('should kill when the strength is reduced to 0 due to a strength increase being removed', function () {
                this.player1.clickCard(this.ice);
                this.player1.clickCard(this.edmure);
                this.completeMarshalPhase();
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.edmure);
                this.player1.clickPrompt('done');
                this.player1.clickPrompt('pass');

                this.player2.clickCard(this.dracarys);
                this.player2.clickCard(this.drogon);
                this.player2.clickCard(this.edmure);

                this.player1.clickPrompt('pass');
                this.player2.clickPrompt('pass');
                this.player2.clickPrompt('done');
                this.player1.clickPrompt('pass');
                this.player2.clickPrompt('pass');
                this.player1.triggerAbility(this.ice);
                this.player1.clickCard(this.drogon);

                expect(this.edmure.location).toBe('dead pile');
            });

            it('should kill when the strength is reduced to 0 due to a strength set effect being removed', function () {
                this.player1.clickCard(this.strangler);
                this.player1.clickCard(this.edmure);
                this.completeMarshalPhase();
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.edmure);
                this.player1.clickPrompt('done');
                this.player1.clickPrompt('pass');

                this.player2.clickCard(this.dracarys);
                this.player2.clickCard(this.drogon);
                this.player2.clickCard(this.edmure);

                this.player1.clickPrompt('pass');
                this.player2.clickPrompt('pass');
                this.player2.clickPrompt('done');
                this.player1.clickPrompt('pass');
                this.player2.clickPrompt('pass');
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard(this.drogon);

                expect(this.edmure.location).toBe('dead pile');
            });

            //TODO - This test exposes a reason having a strength changed event, and hence a burn check on removal of SetStrength effects is necessary.
            // However, this case is more niche than the problem with simultaneous expiration of Blood Of The Dragon and At the Palace of Sorrows that event
            // introduces. There are existing bugs around persistent effects on plot cards coming into play that require a more thorough fix to have the game
            // state changes properly considered as simultaneous (reveal of Palace and Blood when Blood player is host, Randyll and Courtier reacting to reveal
            // of Blood and A Song of Summer etc.). Reintroduce this test and make it pass when a thorough fix of simultaneous strength effects has been implemented

            // it('should immediately kill when the strength is reduced to 0 due to a strength set effect being removed within a challenge', function () {
            //     this.player1.clickCard(this.strangler);
            //     this.player1.clickCard(this.edmure);
            //     this.completeMarshalPhase();
            //     this.player1.clickPrompt('Military');
            //     this.player1.clickCard(this.edmure);
            //     this.player1.clickPrompt('done');
            //     this.player1.clickPrompt('pass');

            //     this.player2.clickCard(this.dracarys);
            //     this.player2.clickCard(this.drogon);
            //     this.player2.clickCard(this.edmure);

            //     this.player1.clickPrompt('pass');

            //     this.player2.clickCard(this.shadow);
            //     this.player2.clickCard(this.strangler);

            //     expect(this.edmure.location).toBe('dead pile');
            // });
        });

        describe('interacting with expiring effects', function () {
            beforeEach(function () {
                let burnDeck = this.buildDeck('targaryen', [
                    'Blood of the Dragon',
                    'A Noble Cause',
                    'A Dragon Is No Slave',
                    'Consuming Flames',
                    'Targaryen Loyalist',
                    'Strangler',
                    'The Roseroad'
                ]);

                let targetDeck = this.buildDeck('tyrell', [
                    'At the Palace of Sorrows (R)',
                    'A Noble Cause',
                    'Courtesan of the Rose',
                    'Hedge Knight',
                    'Gates of the Moon',
                    '"Lord Renly\'s Ride"'
                ]);

                this.player2.selectDeck(burnDeck);
                this.player1.selectDeck(targetDeck);

                this.startGame();
                this.keepStartingHands();

                this.consumingFlames = this.player2.findCardByName('Consuming Flames', 'hand');
                this.reduction = this.player2.findCardByName('A Dragon Is No Slave', 'hand');
                this.targChud = this.player2.findCardByName('Targaryen Loyalist', 'hand');
                this.strangler = this.player2.findCardByName('Strangler', 'hand');
                this.roseroad = this.player2.findCardByName('The Roseroad', 'hand');

                this.gates = this.player1.findCardByName('Gates of the Moon', 'hand');
                this.courtesan = this.player1.findCardByName('Courtesan of the Rose', 'hand');
                this.knight = this.player1.findCardByName('Hedge Knight', 'hand');
                this.strengthBoost = this.player1.findCardByName('"Lord Renly\'s Ride"', 'hand');

                this.player2.clickCard(this.targChud);
                this.player2.clickCard(this.roseroad);
                this.player1.clickCard(this.courtesan);
                this.player1.dragCard(this.knight, 'dead pile');
                this.player1.clickCard(this.gates);
                this.completeSetup();
            });

            it('should not kill due to simultaneous expirations of reduction and boost at the end of a phase', function () {
                this.player2.selectPlot('Blood of the Dragon');
                this.player1.selectPlot('A Noble Cause');

                this.selectFirstPlayer(this.player1);

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.game.currentPhase).toBe('challenge');

                this.player1.clickCard(this.strengthBoost);
                this.player1.clickCard(this.courtesan);

                expect(this.courtesan.getStrength()).toBe(3);

                this.player2.clickCard(this.reduction);
                this.player2.clickCard(this.courtesan);

                expect(this.courtesan.getStrength()).toBe(1);

                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                expect(this.courtesan.location).toBe('play area');
                expect(this.game.currentPhase).toBe('plot');
            });

            it('should not kill when one set effect is replaced by another', function () {
                this.player2.selectPlot('Blood of the Dragon');
                this.player1.selectPlot('At the Palace of Sorrows (R)');

                this.selectFirstPlayer(this.player1);

                expect(this.courtesan.getStrength()).toBe(3);
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.strangler);
                this.player2.clickCard(this.courtesan);

                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('power');
                this.player1.clickCard(this.courtesan);
                this.player1.clickPrompt('Done');
                expect(this.courtesan.getStrength()).toBe(1);

                this.player1.clickPrompt('Pass');

                this.player2.clickCard(this.consumingFlames);
                this.player2.clickCard(this.reduction);
                this.player2.clickCard(this.courtesan);

                expect(this.courtesan.getStrength()).toBe(1);

                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');

                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');

                this.player1.clickPrompt('Apply Claim');

                expect(this.courtesan.location).toBe('play area');
                expect(this.courtesan.getStrength()).toBe(3);
            });

            it('should not kill due to simultaneous change of plots', function () {
                this.player2.selectPlot('Blood of the Dragon');
                this.player1.selectPlot('At the Palace of Sorrows (R)');

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();
                expect(this.game.currentPhase).toBe('plot');
                expect(this.targChud.location).toBe('play area');
            });
        });
    });
});
