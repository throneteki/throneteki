describe('The White Book', function() {
    integration(function() {
        describe('when the player does not control a King or Queen', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'The White Book',
                    'A Noble Cause',
                    'Hedge Knight', 'Ser Arys Oakheart (TC)'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.kingsguard = this.player1.findCardByName('Ser Arys Oakheart (TC)', 'hand');
                this.opponentChar = this.player2.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard(this.kingsguard);
                this.player2.clickCard(this.opponentChar);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            describe('when winning on attack', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.kingsguard);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                });

                it('does not allow to trigger', function() {
                    expect(this.player1).not.toAllowAbilityTrigger('The White Book');
                });
            });

            describe('when winning on defense', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');

                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.opponentChar);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player1.clickCard(this.kingsguard);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();
                });

                it('stands defending characters', function() {
                    this.player1.triggerAbility('The White Book');

                    expect(this.kingsguard.kneeled).toBe(false);
                });
            });
        });

        describe('when the player controls a King or Queen', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'The White Book',
                    'A Noble Cause',
                    'Hedge Knight', 'Ser Arys Oakheart (TC)', 'Jeyne Westerling'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.kingsguard = this.player1.findCardByName('Ser Arys Oakheart (TC)', 'hand');
                this.opponentChar = this.player2.findCardByName('Hedge Knight', 'hand');

                this.player1.clickCard(this.kingsguard);
                this.player1.clickCard('Jeyne Westerling', 'hand');
                this.player2.clickCard(this.opponentChar);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            describe('when winning on attack', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Power');
                    this.player1.clickCard(this.kingsguard);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();
                });

                it('stands attacking characters', function() {
                    this.player1.triggerAbility('The White Book');

                    expect(this.kingsguard.kneeled).toBe(false);
                });
            });

            describe('when winning on defense', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');

                    this.player2.clickPrompt('Military');
                    this.player2.clickCard(this.opponentChar);
                    this.player2.clickPrompt('Done');

                    this.skipActionWindow();

                    this.player1.clickCard(this.kingsguard);
                    this.player1.clickPrompt('Done');

                    this.skipActionWindow();
                });

                it('stands defending characters', function() {
                    this.player1.triggerAbility('The White Book');

                    expect(this.kingsguard.kneeled).toBe(false);
                });
            });
        });
    });
});
