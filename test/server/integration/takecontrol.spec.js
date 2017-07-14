/* global describe, it, expect, beforeEach, integration */
/* eslint camelcase: 0, no-invalid-this: 0 */

describe('take control', function() {
    integration(function() {
        describe('when using an attachment to take control', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('stark', [
                    'Sneak Attack', 'A Noble Cause', 'Valar Morghulis',
                    'Ward'
                ]);
                const deck2 = this.buildDeck('tyrell', [
                    'Sneak Attack', 'Confiscation',
                    'Paxter Redwyne', 'Paxter Redwyne'
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
                expect(this.paxter.dupes.size()).toBe(1);                

                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);
                this.player1.clickCard(this.ward);
                this.player1.clickCard(this.paxter);
            });

            it('should allow characters to be taken control', function() {
                expect(this.paxter.controller).toBe(this.player1Object);
            });

            describe('when the character would be killed', function() {
                beforeEach(function() {
                    // Complete round 1
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                    this.completeTaxationPhase();

                    // Select plots for round 2
                    this.player1.selectPlot('Valar Morghulis');
                    this.player2.selectPlot('Confiscation');

                    this.selectFirstPlayer(this.player1);
                });

                describe('and Valar goes before Confiscation', function() {
                    beforeEach(function() {
                        this.selectPlotOrder(this.player1);
                    });

                    it('should kill the character even with dupes', function() {
                        expect(this.paxter.location).toBe('dead pile');
                    });
                });

                describe('and Confiscation goes before Valar', function() {
                    beforeEach(function() {
                        this.selectPlotOrder(this.player2);

                        // Remove the Ward via Confiscation
                        this.player2.clickCard(this.ward);

                        // Complete marshal phase to ensure both players have collected their gold
                        this.completeMarshalPhase();
                    });

                    it('should allow the character to be saved via the dupe', function() {
                        expect(this.paxter.location).toBe('play area');
                        expect(this.dupe.location).toBe('discard pile');
                    });

                    it('should return the character', function() {
                        expect(this.paxter.controller.name).toBe(this.player2Object.name);
                    });

                    it('should properly calculate any effects from the returned character', function() {
                        // 4 gold from plot, 1 gold from Paxter
                        expect(this.player2Object.gold).toBe(5);
                    });

                    it('should not give the opponent the effects of the returned character', function() {
                        // 2 gold from plot, 0 gold from Paxter
                        expect(this.player1Object.gold).toBe(2);
                    });
                });
            });

            describe('when the effect is removed during plot phase', function() {
                beforeEach(function() {
                    // Complete round 1
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();
                    this.completeTaxationPhase();

                    // Select plots for round 2
                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('Confiscation');
                    this.selectFirstPlayer(this.player1);

                    // Remove the Ward via Confiscation
                    this.player2.clickCard(this.ward);

                    // Complete marshal phase to ensure both players have collected their gold
                    this.completeMarshalPhase();
                });

                it('should return the character', function() {
                    expect(this.paxter.controller.name).toBe(this.player2Object.name);
                });

                it('should properly calculate any effects from the returned character', function() {
                    // 4 gold from plot, 1 gold from Paxter
                    expect(this.player2Object.gold).toBe(5);
                });

                it('should not give the opponent the effects of the returned character', function() {
                    // 5 gold from plot, 0 gold from Paxter
                    expect(this.player1Object.gold).toBe(5);
                });
            });
        });

        describe('when a permanent take control occurs', function() {
            beforeEach(function() {
                const deck = this.buildDeck('greyjoy', [
                    'Sneak Attack',
                    'Euron Crow\'s Eye (Core)', 'The Kingsroad', 'Theon Greyjoy (Core)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.euron = this.player1.findCardByName('Euron Crow\'s Eye');
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
                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                // Use Euron to take control of the opponent Kingsroad.
                this.player1.clickPrompt('Euron Crow\'s Eye');
                this.player1.clickCard(this.kingsroad);

                expect(this.kingsroad.controller).toBe(this.player1Object);
                expect(this.kingsroad.location).toBe('play area');

                // Complete challenges phase
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Done');

                // Complete round
                this.completeTaxationPhase();

                // Round 2
                this.player1.selectPlot('Sneak Attack');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);
            });

            it('should allow card abilities to be used', function() {
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

        describe('take control + persistent effects', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('greyjoy', [
                    'Trading with the Pentoshi',
                    'Euron Crow\'s Eye (Core)', 'Maester Aemon (Core)', 'Sea Bitch', 'Ward'
                ]);
                const deck2 = this.buildDeck('thenightswatch', [
                    'Trading with the Pentoshi',
                    'Steward at the Wall', 'The Wall'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.euron = this.player1.findCardByName('Euron Crow\'s Eye', 'hand');
                this.aemon = this.player1.findCardByName('Maester Aemon', 'hand');
                this.steward = this.player2.findCardByName('Steward at the Wall', 'hand');
                this.wall = this.player2.findCardByName('The Wall', 'hand');

                this.player1.clickCard(this.euron);
                this.player2.clickCard(this.steward);

                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');
            });

            describe('when it comes into play under control', function() {
                beforeEach(function() {
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
                    this.skipActionWindow();

                    this.player1.clickPrompt('Apply Claim');

                    // Use Euron to take control of the opponent Wall.
                    this.player1.clickPrompt('Euron Crow\'s Eye');
                    this.player1.clickCard(this.wall);

                    expect(this.player1Object.cardsInPlay.pluck('uuid')).toContain(this.wall.uuid);
                    expect(this.wall.controller.name).toBe(this.player1Object.name);
                    expect(this.wall.location).toBe('play area');
                });

                it('should apply the effect to the new controller', function() {
                    expect(this.aemon.getStrength()).toBe(3);
                });

                it('should not apply the effect to the old controller', function() {
                    expect(this.steward.getStrength()).toBe(1);
                });
            });

            describe('when it transfers control', function() {
                beforeEach(function() {
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);

                    this.seaBitch = this.player1.findCardByName('Sea Bitch', 'hand');

                    // Marshal cards
                    this.player1.clickCard(this.aemon);
                    this.player1.clickCard(this.seaBitch);
                    this.player1.clickPrompt('Done');
                    this.player2.clickCard(this.wall);
                    this.player2.clickPrompt('Done');

                    expect(this.steward.getStrength()).toBe(2);

                    // Use Sea Bitch to take control of the opponent Wall.
                    this.player1.clickMenu(this.seaBitch, 'Sacrifice this card');
                    this.player1.clickCard(this.wall);

                    expect(this.player1Object.cardsInPlay.pluck('uuid')).toContain(this.wall.uuid);
                    expect(this.wall.controller.name).toBe(this.player1Object.name);
                    expect(this.wall.location).toBe('play area');
                });

                it('should apply the effect to the new controller', function() {
                    expect(this.aemon.getStrength()).toBe(3);
                });

                it('should unapply the effect from the old controller', function() {
                    expect(this.steward.getStrength()).toBe(1);
                });
            });

            describe('when control of effect-modified character is transfered', function() {
                beforeEach(function() {
                    this.selectFirstPlayer(this.player2);
                    this.selectPlotOrder(this.player2);

                    // Marshal cards
                    this.player2.clickCard(this.wall);
                    this.player2.clickPrompt('Done');
                    this.player1.clickCard('Ward', 'hand');
                    this.player1.clickCard(this.steward);

                    expect(this.player1Object.cardsInPlay.pluck('uuid')).toContain(this.steward.uuid);
                    expect(this.steward.controller.name).toBe(this.player1Object.name);
                    expect(this.steward.location).toBe('play area');
                });

                it('should unapply the effect from the old controller', function() {
                    expect(this.steward.getStrength()).toBe(1);
                });
            });
        });

        describe('take control + abilities', function() {
            beforeEach(function() {
                const deck = this.buildDeck('greyjoy', [
                    'Trading with the Pentoshi',
                    'Euron Crow\'s Eye (Core)', 'Iron Mines', 'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.euron = this.player1.findCardByName('Euron Crow\'s Eye', 'hand');
                this.mines = this.player2.findCardByName('Iron Mines', 'hand');

                this.completeSetup();

                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('Trading with the Pentoshi');

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                this.player2Object.moveCard(this.mines, 'draw deck');

                this.player1.clickCard('Euron Crow\'s Eye', 'hand');
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
                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                // Use Euron to take control of the opponent Iron Mines.
                this.player1.clickPrompt('Euron Crow\'s Eye');
                this.player1.clickCard(this.mines);
            });

            it('should trigger for the current player', function() {
                let knight = this.player1.findCardByName('Hedge Knight', 'play area');

                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Military');
                this.player2.clickCard('Hedge Knight', 'play area');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();
                this.skipActionWindow();

                this.player2.clickPrompt('Apply Claim');

                this.player1.clickCard(knight);

                this.player1.clickPrompt('Iron Mines');
                expect(this.player1).toHavePrompt('Select character to save');
                this.player1.clickCard(knight);

                expect(this.player1).not.toHavePrompt('Select character to save');
                expect(knight.location).toBe('play area');
            });

            it('should not trigger for the opponent', function() {
                this.player1.clickPrompt('Military');
                this.player1.clickCard('Hedge Knight', 'play area');
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();
                this.skipActionWindow();

                this.player1.clickPrompt('Apply Claim');

                this.player2.clickCard('Hedge Knight', 'play area');

                expect(this.player1).not.toHavePromptButton('Iron Mines');
                expect(this.player2).not.toHavePromptButton('Iron Mines');
            });
        });

        describe('put into play under control + abilities', function() {
            beforeEach(function() {
                const deck = this.buildDeck('greyjoy', [
                    'Snowed Under',
                    'Night Gathers...', 'Lost Ranger', 'Old Forest Hunter'
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
                this.player2.selectPlot('Snowed Under');

                this.selectFirstPlayer(this.player1);

                this.player1.clickCard('Night Gathers...', 'hand');

                // Marshal Lost Ranger + Old Forest Hunter
                this.player1.clickCard(this.ranger);
                this.player1.clickCard(this.hunter);

                expect(this.player1Object.cardsInPlay).toContain(this.ranger);
                expect(this.player1Object.cardsInPlay).toContain(this.hunter);
            });

            it('should not trigger Lost Ranger\'s forced interrupt since there is another Ranger in play.', function() {
                this.completeMarshalPhase();
                this.completeChallengesPhase();

                expect(this.ranger.location).toBe('play area');
            });
        });
    });
});
