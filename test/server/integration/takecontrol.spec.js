describe('take control', function () {
    integration(function () {
        describe('when using an attachment to take control', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('stark', [
                    'Sneak Attack',
                    'A Noble Cause',
                    'Valar Morghulis',
                    'Ward (TS)'
                ]);
                const deck2 = this.buildDeck('tyrell', [
                    'Sneak Attack',
                    'Confiscation',
                    'Paxter Redwyne',
                    'Paxter Redwyne'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.ward = this.player1.findCardByName('Ward');
                [this.paxter, this.dupe] = this.player2.filterCardsByName('Paxter Redwyne');

                // Setup Paxter with a dupe.
                this.player2.clickCard(this.paxter);
                this.player2.clickCard(this.dupe);

                this.completeSetup();
                expect(this.paxter.dupes.length).toBe(1);

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);
                this.player1.clickCard(this.ward);
                this.player1.clickCard(this.paxter);
            });

            it('should allow characters to be taken control', function () {
                expect(this.paxter.controller).toBe(this.player1Object);
            });

            describe('when the character would be killed', function () {
                beforeEach(function () {
                    // Complete round 1
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();

                    // Select plots for round 2
                    this.player1.selectPlot('Valar Morghulis');

                    this.selectFirstPlayer(this.player1);
                });

                describe('and Valar goes before Confiscation', function () {
                    beforeEach(function () {
                        this.selectPlotOrder(this.player1);
                    });

                    it('should kill the character if the owner passes on their dupe', function () {
                        this.player2.clickPrompt('Pass');

                        expect(this.paxter.location).toBe('dead pile');
                    });
                });

                describe('and Confiscation goes before Valar', function () {
                    beforeEach(function () {
                        this.selectPlotOrder(this.player2);

                        // Remove the Ward via Confiscation
                        this.player2.clickCard(this.ward);

                        // Complete marshal phase to ensure both players have collected their gold
                        this.completeMarshalPhase();
                    });

                    it('should allow the character to be saved via the dupe', function () {
                        expect(this.paxter.location).toBe('play area');
                        expect(this.dupe.location).toBe('discard pile');
                    });

                    it('should return the character', function () {
                        expect(this.paxter.controller.name).toBe(this.player2Object.name);
                    });

                    it('should properly calculate any effects from the returned character', function () {
                        // 4 gold from plot, 1 gold from Paxter
                        expect(this.player2Object.gold).toBe(5);
                    });

                    it('should not give the opponent the effects of the returned character', function () {
                        // 2 gold from plot, 0 gold from Paxter
                        expect(this.player1Object.gold).toBe(2);
                    });
                });
            });

            describe('when the effect is removed during plot phase', function () {
                beforeEach(function () {
                    // Complete round 1
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();

                    // Select plots for round 2
                    this.player1.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);

                    // Remove the Ward via Confiscation
                    this.player2.clickCard(this.ward);

                    // Complete marshal phase to ensure both players have collected their gold
                    this.completeMarshalPhase();
                });

                it('should return the character', function () {
                    expect(this.paxter.controller.name).toBe(this.player2Object.name);
                });

                it('should properly calculate any effects from the returned character', function () {
                    // 4 gold from plot, 1 gold from Paxter
                    expect(this.player2Object.gold).toBe(5);
                });

                it('should not give the opponent the effects of the returned character', function () {
                    // 5 gold from plot, 0 gold from Paxter
                    expect(this.player1Object.gold).toBe(5);
                });
            });
        });

        describe('when a permanent take control occurs', function () {
            beforeEach(function () {
                const deck = this.buildDeck('greyjoy', [
                    'Sneak Attack',
                    'Sneak Attack',
                    "Euron Crow's Eye (Core)",
                    'The Kingsroad',
                    'Theon Greyjoy (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.euron = this.player1.findCardByName("Euron Crow's Eye");
                this.kingsroad = this.player2.findCardByName('The Kingsroad');

                this.player1.clickCard(this.euron);

                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');

                this.selectFirstPlayer(this.player1);

                // Move Kingsroad back into draw deck for Euron's pillage.
                this.kingsroad.controller.moveCard(this.kingsroad, 'draw deck');

                this.completeMarshalPhase();

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.euron);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                // Use Euron to take control of the opponent Kingsroad.
                this.player1.triggerAbility("Euron Crow's Eye");
                this.player1.clickCard(this.kingsroad);

                expect(this.kingsroad.controller).toBe(this.player1Object);
                expect(this.kingsroad.location).toBe('play area');

                // Complete challenges phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                // Round 2
                this.selectFirstPlayer(this.player1);
            });

            it('should allow card abilities to be used', function () {
                let reduceableCard = this.player1.findCardByName('Theon Greyjoy', 'hand');
                this.player1.clickCard(this.kingsroad);
                this.player1.clickCard(reduceableCard);

                // 5 gold from plot - 4 from Theon + 3 reduction from Kingsroad
                expect(this.player1Object.gold).toBe(4);
                expect(reduceableCard.location).toBe('play area');
                expect(this.kingsroad.location).toBe('discard pile');
                expect(this.kingsroad.controller.name).toBe(this.player2Object.name);
            });
        });

        describe('take control + persistent effects', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('greyjoy', [
                    'Trading with the Pentoshi',
                    "Euron Crow's Eye (Core)",
                    'Maester Aemon (Core)',
                    'Sea Bitch',
                    'Ward (TS)'
                ]);
                const deck2 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'Samwell Tarly (Core)',
                    'The Wall (Core)'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.euron = this.player1.findCardByName("Euron Crow's Eye", 'hand');
                this.aemon = this.player1.findCardByName('Maester Aemon', 'hand');
                this.samwell = this.player2.findCardByName('Samwell Tarly', 'hand');
                this.wall = this.player2.findCardByName('The Wall', 'hand');

                this.player1.clickCard(this.euron);
                this.player2.clickCard(this.samwell);

                this.completeSetup();
            });

            describe('when it comes into play under control', function () {
                beforeEach(function () {
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);

                    // Move The Wall back into draw deck for Euron's pillage.
                    this.wall.controller.moveCard(this.wall, 'draw deck');

                    // Marshal cards
                    this.player1.clickCard(this.aemon);
                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Done');

                    // Challenges
                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.euron);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player1.clickPrompt('Apply Claim');

                    // Use Euron to take control of the opponent Wall.
                    this.player1.triggerAbility("Euron Crow's Eye");
                    this.player1.clickCard(this.wall);

                    expect(this.player1Object.cardsInPlay.map((card) => card.uuid)).toContain(
                        this.wall.uuid
                    );
                    expect(this.wall.controller.name).toBe(this.player1Object.name);
                    expect(this.wall.location).toBe('play area');
                });

                it('should apply the effect to the new controller', function () {
                    expect(this.aemon.getStrength()).toBe(3);
                });

                it('should not apply the effect to the old controller', function () {
                    expect(this.samwell.getStrength()).toBe(1);
                });
            });

            describe('when it transfers control', function () {
                beforeEach(function () {
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);

                    this.seaBitch = this.player1.findCardByName('Sea Bitch', 'hand');

                    // Marshal cards
                    this.player1.clickCard(this.aemon);
                    this.player1.clickCard(this.seaBitch);
                    this.player1.clickPrompt('Done');
                    this.player2.clickCard(this.wall);
                    this.player2.clickPrompt('Done');

                    expect(this.samwell.getStrength()).toBe(2);

                    // Use Sea Bitch to take control of the opponent Wall.
                    this.player1.clickMenu(this.seaBitch, 'Take control of location');
                    this.player1.clickCard(this.wall);

                    expect(this.player1Object.cardsInPlay.map((card) => card.uuid)).toContain(
                        this.wall.uuid
                    );
                    expect(this.wall.controller.name).toBe(this.player1Object.name);
                    expect(this.wall.location).toBe('play area');
                });

                it('should apply the effect to the new controller', function () {
                    expect(this.aemon.getStrength()).toBe(3);
                });

                it('should unapply the effect from the old controller', function () {
                    expect(this.samwell.getStrength()).toBe(1);
                });
            });

            describe('when control of effect-modified character is transfered', function () {
                beforeEach(function () {
                    this.selectFirstPlayer(this.player2);
                    this.selectPlotOrder(this.player2);

                    // Marshal cards
                    this.player2.clickCard(this.wall);
                    this.player2.clickPrompt('Done');
                    this.player1.clickCard('Ward', 'hand');
                    this.player1.clickCard(this.samwell);

                    expect(this.player1Object.cardsInPlay.map((card) => card.uuid)).toContain(
                        this.samwell.uuid
                    );
                    expect(this.samwell.controller.name).toBe(this.player1Object.name);
                    expect(this.samwell.location).toBe('play area');
                });

                it('should unapply the effect from the old controller', function () {
                    expect(this.samwell.getStrength()).toBe(1);
                });
            });
        });

        describe('take control + abilities', function () {
            beforeEach(function () {
                const deck = this.buildDeck('greyjoy', [
                    'Trading with the Pentoshi',
                    "Euron Crow's Eye (Core)",
                    'Iron Mines (CoW)',
                    'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.euron = this.player1.findCardByName("Euron Crow's Eye", 'hand');
                this.mines = this.player2.findCardByName('Iron Mines', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player2Object.moveCard(this.mines, 'draw deck');

                this.player1.clickCard("Euron Crow's Eye", 'hand');
                this.player1.clickCard('Hedge Knight', 'hand');
                this.player1.clickPrompt('Done');
                this.player2.clickCard('Hedge Knight', 'hand');
                this.player2.clickPrompt('Done');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.euron);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                // Use Euron to take control of the opponent Iron Mines.
                this.player1.triggerAbility("Euron Crow's Eye");
                this.player1.clickCard(this.mines);
            });

            it('should trigger for the current player', function () {
                let knight = this.player1.findCardByName('Hedge Knight', 'play area');

                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Military');
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Apply Claim');

                this.player1.clickCard(knight);

                this.player1.triggerAbility('Iron Mines');
                // Because there is only one character to save, the choice of
                // character is implicit and not prompted.

                expect(knight.location).toBe('play area');
            });

            it('should not trigger for the opponent', function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard('Hedge Knight', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                this.player2.clickCard('Hedge Knight', 'play area');

                expect(this.player1).not.toAllowAbilityTrigger('Iron Mines');
                expect(this.player2).not.toAllowAbilityTrigger('Iron Mines');
            });
        });

        describe('put into play under control + abilities', function () {
            beforeEach(function () {
                const deck = this.buildDeck('greyjoy', [
                    'Snowed Under',
                    'A Storm of Swords',
                    'Night Gathers...',
                    'Lost Ranger',
                    'Old Forest Hunter'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.ranger = this.player2.findCardByName('Lost Ranger', 'hand');
                this.hunter = this.player2.findCardByName('Old Forest Hunter', 'hand');

                // Drag these to discard to be available for Night Gathers
                this.player2.dragCard(this.ranger, 'discard pile');
                this.player2.dragCard(this.hunter, 'discard pile');

                this.completeSetup();

                this.player1.selectPlot('Snowed Under');
                this.player2.selectPlot('A Storm of Swords');

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Night Gathers...', 'hand');

                // Marshal Lost Ranger + Old Forest Hunter
                this.player1.clickCard(this.ranger);
                this.player1.clickCard(this.hunter);

                expect(this.player1Object.cardsInPlay).toContain(this.ranger);
                expect(this.player1Object.cardsInPlay).toContain(this.hunter);
            });

            it("should not trigger Lost Ranger's forced interrupt since there is another Ranger in play.", function () {
                this.completeMarshalPhase();
                this.completeChallengesPhase();

                expect(this.ranger.location).toBe('play area');
            });
        });

        describe('take control + uniqueness', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('greyjoy', [
                    'Trading with the Pentoshi',
                    'Ward (TS)',
                    'Night Gathers...',
                    'Will'
                ]);
                const deck2 = this.buildDeck('thenightswatch', ['A Noble Cause', 'Will', 'Will']);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.ourCharacter = this.player1.findCardByName('Will', 'hand');
                [this.theirCharacter, this.theirDupe] = this.player2.filterCardsByName(
                    'Will',
                    'hand'
                );
            });

            describe('when the player has a character out', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.ourCharacter);
                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);

                    expect(this.ourCharacter.location).toBe('play area');
                });

                it('should not be able to put an opponents copy into play', function () {
                    this.player2.dragCard(this.theirCharacter, 'discard pile');
                    this.player1.clickCard('Night Gathers...');
                    this.player1.clickCard(this.theirCharacter);

                    expect(this.theirCharacter.location).toBe('discard pile');
                    expect(this.theirCharacter).toBeControlledBy(this.player2);
                });

                it('should not be able to take control of an opponents copy already in play', function () {
                    this.player2.dragCard(this.theirCharacter, 'play area');
                    this.player1.clickCard('Ward');
                    this.player1.clickCard(this.theirCharacter);

                    expect(this.theirCharacter).toBeControlledBy(this.player2);
                });
            });

            describe('when the player has a character in their own dead pile', function () {
                beforeEach(function () {
                    this.player1.dragCard(this.ourCharacter, 'dead pile');
                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);
                });

                it('should not be able to put an opponents copy into play', function () {
                    this.player2.dragCard(this.theirCharacter, 'discard pile');
                    this.player1.clickCard('Night Gathers...');
                    this.player1.clickCard(this.theirCharacter);

                    expect(this.theirCharacter.location).toBe('discard pile');
                    expect(this.theirCharacter).toBeControlledBy(this.player2);
                });

                it('should not be able to take control of an opponents copy already in play', function () {
                    this.player2.dragCard(this.theirCharacter, 'play area');
                    this.player1.clickCard('Ward');
                    this.player1.clickCard(this.theirCharacter);

                    expect(this.theirCharacter).toBeControlledBy(this.player2);
                });
            });

            describe('when the player controls an opponents character', function () {
                beforeEach(function () {
                    this.player2.clickCard(this.theirCharacter);
                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);

                    this.player1.clickCard('Ward');
                    this.player1.clickCard(this.theirCharacter);

                    expect(this.theirCharacter.location).toBe('play area');
                    expect(this.theirCharacter).toBeControlledBy(this.player1);
                });

                it('should not allow the player to put out their own copy', function () {
                    this.player1.clickCard(this.ourCharacter);

                    expect(this.ourCharacter.location).toBe('hand');
                });

                it('should not allow the opponent to put out another copy', function () {
                    this.player1.clickPrompt('Done');
                    this.player2.clickCard(this.theirDupe);

                    expect(this.theirDupe.location).toBe('hand');
                });
            });

            describe('when the opponent has the character out', function () {
                beforeEach(function () {
                    this.player2.clickCard(this.theirCharacter);
                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);
                });

                it('should not allow the player to put into play another copy owned by the opponent', function () {
                    this.player2.dragCard(this.theirDupe, 'discard pile');
                    this.player1.clickCard('Night Gathers...');
                    this.player1.clickCard(this.theirDupe);

                    expect(this.theirDupe.location).toBe('discard pile');
                    expect(this.theirDupe).toBeControlledBy(this.player2);
                });

                it('should not allow the player to take control of it if another copy is in the opponents dead pile', function () {
                    this.player2.dragCard(this.theirDupe, 'dead pile');
                    this.player1.clickCard('Ward');
                    this.player1.clickCard(this.theirCharacter);

                    expect(this.theirCharacter.location).toBe('play area');
                    expect(this.theirCharacter).toBeControlledBy(this.player2);
                });
            });

            describe('when the opponent has the character in their dead pile', function () {
                beforeEach(function () {
                    this.player2.dragCard(this.theirCharacter, 'dead pile');
                    this.completeSetup();

                    this.selectFirstPlayer(this.player1);
                });

                it('should not allow the player to put into play another copy owned by the opponent', function () {
                    this.player2.dragCard(this.theirDupe, 'discard pile');
                    this.player1.clickCard('Night Gathers...');
                    this.player1.clickCard(this.theirDupe);

                    expect(this.theirDupe.location).toBe('discard pile');
                    expect(this.theirDupe).toBeControlledBy(this.player2);
                });
            });
        });

        describe('repeated take control', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('tyrell', [
                    'Sneak Attack',
                    'The First Snow of Winter',
                    'A Game of Thrones',
                    'Margaery Tyrell (Core)'
                ]);
                const deck2 = this.buildDeck('stark', [
                    'Sneak Attack',
                    'A Game of Thrones',
                    'A Game of Thrones',
                    'Ward (TS)',
                    'Ward (TS)'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Margaery Tyrell', 'hand');
                [this.ward1, this.ward2] = this.player2.filterCardsByName('Ward');

                this.player1.clickCard(this.character);
                this.completeSetup();

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                this.player1.clickPrompt('Done');

                this.player2.clickCard(this.ward1);
                this.player2.clickCard(this.character);

                expect(this.character).toBeControlledBy(this.player2);

                this.player2.clickPrompt('Done');
                this.completeChallengesPhase();

                this.player1.selectPlot('The First Snow of Winter');
                this.player2.selectPlot('A Game of Thrones');
                this.selectFirstPlayer(this.player1);
                this.completeMarshalPhase();

                // First Snow returns controlled character to hand
                expect(this.character).toBeControlledBy(this.player1);
                expect(this.character.location).toBe('hand');
                expect(this.ward1.location).toBe('discard pile');

                this.completeChallengesPhase();

                this.selectFirstPlayer(this.player1);

                // Remarshal the character
                this.player1.clickCard(this.character);
                this.player1.clickPrompt('Done');

                expect(this.character.location).toBe('play area');
                expect(this.character).toBeControlledBy(this.player1);

                this.player2.clickCard(this.ward2);
                this.player2.clickCard(this.character);
            });

            it('should take control again', function () {
                expect(this.character.attachments).toContain(this.ward2);
                expect(this.character).toBeControlledBy(this.player2);
            });
        });

        describe('take control + leaving play', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('greyjoy', [
                    'Snowed Under',
                    'Night Gathers...',
                    'Varys (Core)'
                ]);
                const deck2 = this.buildDeck('greyjoy', ['A Storm of Swords', 'Old Forest Hunter']);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.player1.clickCard('Varys', 'hand');

                this.character = this.player2.findCardByName('Old Forest Hunter', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Drag these to discard to be available for Night Gathers
                this.player2.dragCard(this.character, 'discard pile');

                this.player1.clickCard('Night Gathers...', 'hand');
                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('play area');
                expect(this.character).toBeControlledBy(this.player1);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.triggerAbility('Varys');
            });

            it("should place the character in the proper owner's pile", function () {
                expect(this.player2Object.discardPile).toContain(this.character);
            });
        });

        describe('competing take control', function () {
            beforeEach(function () {
                const deck = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    'Sea Bitch',
                    "Nagga's Ribs"
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.location = this.player2.findCardByName("Nagga's Ribs", 'hand');

                this.player1.clickCard('Sea Bitch', 'hand');
                this.player2.clickCard('Sea Bitch', 'hand');
                this.player2.clickCard(this.location);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Steal the location
                this.player1.clickMenu('Sea Bitch', 'Take control of location');
                this.player1.clickCard(this.location);

                expect(this.location).toBeControlledBy(this.player1);

                // Steal it back
                this.player2.clickMenu('Sea Bitch', 'Take control of location');
                this.player2.clickCard(this.location);

                expect(this.location).toBeControlledBy(this.player2);

                // Finish phase, allow effects to expire
                this.completeMarshalPhase();
            });

            it('should revert control properly', function () {
                expect(this.location).toBeControlledBy(this.player2);
            });
        });

        describe('taking control of a card with power', function () {
            beforeEach(function () {
                this.game.disableWinning = false;

                const deck = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    // Add enough cards so that a winner isn't chosen by the players being decked
                    'Small Council Chamber',
                    'Small Council Chamber',
                    'Small Council Chamber',
                    'Small Council Chamber',
                    'Small Council Chamber',
                    'Small Council Chamber',
                    'Sea Bitch',
                    'Sea Bitch',
                    'Sea Bitch',
                    'Sea Bitch',
                    'Sea Bitch',
                    'Sea Bitch'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.seaBitch = this.player1.findCardByName('Sea Bitch', 'hand');
                this.location = this.player2.findCardByName('Small Council Chamber', 'hand');

                this.player1.clickCard(this.seaBitch);
                this.player2.clickCard(this.location);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                // Set power to 13
                this.player1Object.faction.power = 13;

                // Add 2 power to the location
                this.location.power = 2;

                // Steal the location
                this.player1.clickMenu(this.seaBitch, 'Take control of location');
                this.player1.clickCard(this.location);
            });

            it('should immediately win the game', function () {
                expect(this.location).toBeControlledBy(this.player1);
                expect(this.game.results.winner).toBe(this.player1Object.name);
            });
        });
    });
});
