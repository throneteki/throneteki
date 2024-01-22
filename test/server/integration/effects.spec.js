const {Tokens} = require('../../../server/game/Constants');

describe('effects', function() {
    integration(function() {
        describe('lasting effects', function() {
            describe('when a lasting effect applies to a group of cards', function() {
                beforeEach(function() {
                    const deck = this.buildDeck('martell', [
                        'Trading with the Pentoshi',
                        'Nymeria Sand (TRtW)', 'Dorea Sand', 'Hedge Knight'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    let nymeria = this.player1.findCardByName('Nymeria Sand', 'hand');
                    this.player1.clickCard(nymeria);

                    let opponentCharacter = this.player2.findCardByName('Hedge Knight', 'hand');
                    this.player2.clickCard(opponentCharacter);

                    this.completeSetup();
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);
                    this.completeMarshalPhase();

                    // Steal Military icon and give it to Sand Snake cards
                    this.player1.clickMenu(nymeria, 'Remove and gain icon');
                    this.player1.clickCard(opponentCharacter);
                    this.player1.clickPrompt('Military');
                });

                it('should apply to cards already in play', function() {
                    let nymeria = this.player1.findCardByName('Nymeria Sand', 'play area');
                    expect(nymeria.hasIcon('Military')).toBe(true);
                });

                it('should not apply the effect to new cards that come into play', function() {
                    let dorea = this.player1.findCardByName('Dorea Sand', 'hand');
                    this.player1.dragCard(dorea, 'play area');

                    expect(dorea.hasIcon('Military')).toBe(false);
                });
            });

            describe('when the lasting effect targets a game position', function() {
                beforeEach(function() {
                    const deck = this.buildDeck('stark', [
                        '"The Rains of Castamere"',
                        'Trading with the Pentoshi', 'Sneak Attack',
                        'Catelyn Stark (WotN)', 'Winter Is Coming'
                    ]);

                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.player1.clickCard('Catelyn Stark', 'hand');

                    this.completeSetup();
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);
                    this.completeMarshalPhase();

                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard('Catelyn Stark', 'play area');
                    this.player1.clickPrompt('Done');

                    // Raise claim on currently revealed plot
                    this.player1.clickCard('Winter Is Coming', 'hand');
                    this.player2.clickPrompt('Pass');
                    this.player1.clickPrompt('Pass');

                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();

                    // Trigger Rains to reveal a new plot
                    this.player1.triggerAbility('"The Rains of Castamere"');
                    this.player1.clickCard('Sneak Attack');
                });

                it('should apply to any new cards in that position', function() {
                    let plot = this.player1.findCardByName('Sneak Attack');
                    expect(plot.getClaim()).toBe(3);
                });

                it('should unapply from any new cards that leave that position', function() {
                    let plot = this.player1.findCardByName('Trading with the Pentoshi');
                    expect(plot.getClaim()).toBe(1);
                });
            });

            describe('when losing immunity during a lasting effect', function() {
                beforeEach(function() {
                    const deck = this.buildDeck('targaryen', [
                        'Trading with the Pentoshi',
                        'Daenerys Targaryen (TFM)', 'Drogon (Core)', 'Nightmares', 'Dracarys!'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.dany = this.player1.findCardByName('Daenerys Targaryen (TFM)', 'hand');
                    this.dragon = this.player1.findCardByName('Drogon', 'hand');
                    this.player1.clickCard(this.dany);
                    this.player1.clickCard(this.dragon);

                    this.completeSetup();
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);
                    this.completeMarshalPhase();

                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard(this.dany);
                    this.player1.clickPrompt('Done');

                    this.player1.clickCard('Dracarys!', 'hand');
                    this.player1.clickCard(this.dragon);
                    this.player1.clickCard(this.dany);
                });

                it('should apply the previously immune effect', function() {
                    // Blanking Dany should remove her immunity, and the -4 from
                    // Dracarys! then takes effect, instantly killing her.
                    // Ruling: http://www.cardgamedb.com/forums/index.php?/topic/39830-ruling-faq-21-cannot-be-variableed/
                    this.player1.clickCard('Nightmares', 'hand');
                    this.player1.clickCard(this.dany);

                    expect(this.dany.location).toBe('dead pile');
                });
            });

            describe('when gaining immunity after a lasting effect is applied', function() {
                beforeEach(function() {
                    const deck = this.buildDeck('targaryen', [
                        'Trading with the Pentoshi',
                        'Maester Caleotte', 'Maester Aemon (Core)', 'Benjen Stark', 'Dragonglass Dagger'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.intrigueChar = this.player1.findCardByName('Maester Aemon', 'hand');
                    this.benjen = this.player1.findCardByName('Benjen Stark', 'hand');
                    this.dagger = this.player1.findCardByName('Dragonglass Dagger', 'hand');
                    this.caleotte = this.player2.findCardByName('Maester Caleotte', 'hand');

                    this.player1.clickCard(this.intrigueChar);
                    this.player1.clickCard(this.benjen);
                    this.player2.clickCard(this.caleotte);

                    this.completeSetup();
                    this.selectFirstPlayer(this.player1);
                    this.selectPlotOrder(this.player1);
                    this.completeMarshalPhase();

                    // Lose the first challenge
                    this.player1.clickPrompt('Intrigue');
                    this.player1.clickCard(this.intrigueChar);
                    this.player1.clickPrompt('Done');
                    this.skipActionWindow();
                    this.player2.clickCard(this.caleotte);
                    this.player2.clickPrompt('Done');
                    this.skipActionWindow();

                    // Trigger Caleotte and remove an icon from Benjen
                    this.player2.triggerAbility(this.caleotte);
                    this.player2.clickCard(this.benjen);
                    this.player2.clickPrompt('Military');

                    this.player1.clickPrompt('Apply Claim');

                    // Get Benjen participating in a challenge
                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.benjen);
                    this.player1.clickPrompt('Done');

                    // Manually drag the dagger into play
                    this.player1.dragCard(this.dagger, 'play area');
                    this.player1.clickCard(this.benjen);
                });

                it('should not remove the previously applied effect', function() {
                    expect(this.benjen.hasIcon('Military')).toBe(false);
                });
            });

            describe('when a card leaves and re-enters play', function() {
                beforeEach(function() {
                    const deck = this.buildDeck('targaryen', [
                        'Trading with the Pentoshi',
                        'Daenerys Targaryen (TFM)', 'A Dragon Is No Slave', 'Viserion (Core)', 'Fire and Blood'
                    ]);
                    this.player1.selectDeck(deck);
                    this.player2.selectDeck(deck);
                    this.startGame();
                    this.keepStartingHands();

                    this.character = this.player2.findCardByName('Viserion', 'hand');

                    this.player1.clickCard('Daenerys Targaryen', 'hand');
                    this.player2.clickCard(this.character);

                    this.completeSetup();
                    this.selectFirstPlayer(this.player2);
                    this.selectPlotOrder(this.player1);
                    this.completeMarshalPhase();

                    this.player2.clickPrompt('Power');
                    this.player2.clickCard(this.character);
                    this.player2.clickPrompt('Done');

                    // Kill Viserion
                    this.player1.clickCard('A Dragon Is No Slave', 'hand');
                    this.player1.clickCard(this.character);
                    this.player1.triggerAbility('Daenerys Targaryen');
                    this.player1.clickCard(this.character);

                    // Bring Viserion back into play
                    this.player2.clickCard('Fire and Blood', 'hand');
                    this.player2.clickCard(this.character);
                    this.player2.clickPrompt('Yes');

                    this.player1.clickPrompt('Pass');
                    this.player2.clickPrompt('Pass');
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();

                    // Declare Viserion in a challenge to force a recalculation
                    // of effects
                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.character);
                    this.player2.clickPrompt('Done');
                });

                it('should not re-apply the previously applied effect', function() {
                    // Viserion should remain in play and not immediately killed
                    // by the previous burn effect
                    expect(this.character.location).toBe('play area');
                });
            });
        });

        describe('when blanking / unblanking a dynamically calculated conditional effect', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'Sneak Attack',
                    'Jhogo (TS)', 'Hedge Knight', 'Nightmares'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.jhogo = this.player1.findCardByName('Jhogo', 'hand');

                this.player1.clickCard(this.jhogo);
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // Move a character to the opponent's dead pile so Jhogo gets a
                // strength boost
                let character = this.player2.findCardByName('Hedge Knight', 'hand');
                this.player2.dragCard(character, 'dead pile');

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.jhogo);
                this.player1.clickPrompt('Done');

                expect(this.jhogo.getStrength()).toBe(4);

                this.player1.clickPrompt('Pass');
                this.player2.clickCard('Nightmares', 'hand');
                this.player2.clickCard(this.jhogo);
                this.player1.clickPrompt('Pass');
                this.player2.clickPrompt('Pass');

                expect(this.jhogo.getStrength()).toBe(3);

                // Declare no defenders
                this.player2.clickPrompt('Done');

                this.skipActionWindow();
                this.player1.clickPrompt('Apply Claim');
            });

            it('should not crash when the blank wears off', function() {
                expect(() => {
                    // Complete challenges, so that Nightmares wears off.
                    this.player1.clickPrompt('Done');
                    this.player2.clickPrompt('Done');
                }).not.toThrow();
            });
        });

        describe('when/until phase ends vs at end of phase', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Sneak Attack', 'Winter Festival',
                    'Eddard Stark (WotN)', 'Tyene Sand (TS)',
                    // Add enough cards to prevent being decked to make the
                    // winner assertion in the test reliable.
                    'Hedge Knight', 'Hedge Knight', 'Hedge Knight', 'Hedge Knight',
                    'Hedge Knight', 'Hedge Knight', 'Hedge Knight', 'Hedge Knight',
                    'Hedge Knight', 'Hedge Knight', 'Hedge Knight', 'Hedge Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Eddard Stark');
                this.player1Object.moveCard(this.character, 'hand');
                let tyene = this.player2.findCardByName('Tyene Sand (TS)');
                this.player2Object.moveCard(tyene, 'hand');

                this.player1.clickCard(this.character);
                this.player2.clickCard('Tyene Sand (TS)', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Winter Festival');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player1);

                // Explicitly set power to 13 so that Winter Festival will win the game
                this.character.power = 13;

                this.completeMarshalPhase();

                this.player1.clickPrompt('Done');

                this.player2.clickPrompt('Intrigue');
                this.player2.clickCard('Tyene Sand (TS)');
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.triggerAbility('Tyene Sand');
                this.player2.clickCard(this.character);

                expect(this.character.tokens[Tokens.poison]).toBeTruthy();

                this.player2.clickPrompt('Apply Claim');
                // Skip order of discarded cards
                this.player1.clickPrompt('Done');
                
                this.player2.clickPrompt('Done');

                this.player1.triggerAbility('Winter Festival');
            });

            it('should apply when/until effects before at the end of phase effects', function() {
                // Since Winter Festival should have brought Player 1's total
                // power up to 15 just before the character dies, a winner should
                // be recorded.
                expect(this.game.winner.name).toBe(this.player1Object.name);
                expect(this.character.location).toBe('dead pile');
                expect(this.player1Object.getTotalPower()).toBe(2);
            });
        });

        describe('persistant effects on plots', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'Sneak Attack', 'Famine',
                    'Eddard Stark (WotN)', 'Tyene Sand (TS)', 'Winterfell Steward', 'Winterfell Steward'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Eddard Stark', 'hand');

                this.player1.clickCard(this.character);
                this.player2.clickCard('Tyene Sand (TS)', 'hand');
                this.completeSetup();

                this.player1.selectPlot('Famine');
                this.player2.selectPlot('Sneak Attack');
                this.selectFirstPlayer(this.player2);

                this.player2.clickCard('Winterfell Steward', 'hand');
            });

            describe('when the plot is active', function() {
                it('should apply the effect', function() {
                    expect(this.player2.player.gold).toBe(3);
                });
            });

            describe('when the plot is not active', function() {
                beforeEach(function() {
                    this.completeMarshalPhase();
                    this.completeChallengesPhase();

                    this.selectFirstPlayer(this.player2);
                    this.player2.clickCard('Winterfell Steward', 'hand');
                });

                it('should not apply the effect', function() {
                    expect(this.player2.player.gold).toBe(1);
                });
            });
        });

        describe('parent dependent "while attached" effects while being discarded', function() {
            beforeEach(function() {
                const deck = this.buildDeck('targaryen', [
                    'Confiscation', 'A Noble Cause',
                    'Daenerys Targaryen (Core)', 'Tokar'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.attachment = this.player1.findCardByName('Tokar', 'hand');
                this.character = this.player1.findCardByName('Daenerys Targaryen', 'hand');

                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                this.completeSetup();

                // Attach the Tokar
                this.player1.clickCard(this.attachment);
                this.player1.clickCard(this.character);

                this.player1.selectPlot('Confiscation');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
            });

            it('should not crash', function() {
                expect(() => {
                    // Discard Tokar due to Confiscation
                    this.player1.clickCard(this.attachment);
                }).not.toThrow();
            });
        });
    });
});
