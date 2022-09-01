const {Tokens} = require('../../../../server/game/Constants');

describe('Rickon Stark', function() {
    integration(function() {
        describe('when a normal search would be triggered', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause', 'Here to Serve',
                    'Rickon Stark', 'Maester Aemon (Core)'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.rickon = this.player1.findCardByName('Rickon Stark', 'hand');
                this.p1deckCard = this.player1.findCardByName('Maester Aemon', 'hand');
                this.p2deckCard = this.player2.findCardByName('Maester Aemon', 'hand');

                this.player1.clickCard(this.rickon);

                this.completeSetup();
                
                // Search effect requires card in deck to actually trigger
                this.player1.dragCard(this.p1deckCard, 'draw deck');
                this.player2.dragCard(this.p2deckCard, 'draw deck');
            });

            describe('and the search is for the opponent', function() {
                beforeEach(function() {
                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('Here to Serve');
                    this.selectFirstPlayer(this.player1);
                });

                it('allows Rickon to cancel', function() {
                    expect(this.player1).toAllowAbilityTrigger(this.rickon);
                });
            });

            describe('and the search is for the current player', function() {
                beforeEach(function() {
                    this.player1.selectPlot('Here to Serve');
                    this.player2.selectPlot('A Noble Cause');
                    this.selectFirstPlayer(this.player1);
                });

                it('allows Rickon to cancel', function() {
                    expect(this.player1).toAllowAbilityTrigger(this.rickon);
                });
            });
        });

        describe('when an ability has search under a choice or Then', function() {
            beforeEach(function() {
                const deck1 = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Rickon Stark'
                ]);
                const deck2 = this.buildDeck('greyjoy', [
                    'Sea of Blood (KotI)',
                    'A Noble Cause',
                    'Balon Greyjoy (Core)'
                ]);

                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.rickon = this.player1.findCardByName('Rickon Stark', 'hand');
                this.seaOfBlood = this.player2.findCardByName('Sea of Blood', 'agenda');
                this.opponentCharacter = this.player2.findCardByName('Balon Greyjoy', 'hand');

                this.player1.clickCard(this.rickon);
                this.player2.clickCard(this.opponentCharacter);

                this.completeSetup();

                this.selectFirstPlayer(this.player2);
                this.completeMarshalPhase();

                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.opponentCharacter);
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
                this.player1.clickPrompt('Done');
                this.skipActionWindow();

                this.player2.triggerAbility('Sea of Blood');
            });

            it('allows Rickon to cancel the ability', function() {
                expect(this.player1).toAllowAbilityTrigger(this.rickon);
            });

            it('cancels the full ability before the choice / Then', function() {
                this.player1.triggerAbility(this.rickon);

                // Ensure costs were paid but the pre-then effect didn't resolve
                expect(this.player2Object.faction.kneeled).toBe(true);
                expect(this.seaOfBlood.hasToken(Tokens.blood)).toBe(false);
            });
        });

        describe('when a keyword triggers and the card has the word search in it', function() {
            beforeEach(function() {
                const deck = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Rickon Stark', 'Euron Crow\'s Eye (KotI)'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.rickon = this.player1.findCardByName('Rickon Stark', 'hand');
                this.euron = this.player2.findCardByName('Euron Crow\'s Eye', 'hand');

                this.player1.clickCard(this.rickon);
                this.player2.clickCard(this.euron);

                this.completeSetup();
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.player2.clickPrompt('Power');
                this.player2.clickCard(this.euron);
                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Apply Claim');

                // Intimidate Rickon
                this.player2.clickCard(this.rickon);
            });

            it('does not allow Rickon to cancel', function() {
                expect(this.player1).not.toAllowAbilityTrigger(this.rickon);
            });
        });
    });
});
