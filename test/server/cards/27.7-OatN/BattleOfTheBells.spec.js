describe('Battle of the Bells', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('baratheon', [
                'Battle of the Bells',
                'Robert Baratheon (Core)',
                'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Margaery Tyrell (Core)',
                'Arbor Knight'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.robert = this.player1.findCardByName('Robert Baratheon', 'hand');

            this.margaery = this.player2.findCardByName('Margaery Tyrell', 'hand');
            this.arborKnight = this.player2.findCardByName('Arbor Knight', 'hand');

            this.player1.clickCard(this.robert);

            this.player2.clickCard(this.margaery);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when Battle of the Bells is active', function () {
            beforeEach(function () {
                this.completeMarshalPhase();
            });

            describe('when a card enters play', function () {
                beforeEach(function () {
                    // Marshal the Arbor Knight to trigger enters play abilities
                    this.player2Object.gold = 5;
                    this.player2.clickCard(this.arborKnight);
                });

                it('should prevent abilities that react to cards entering play', function () {
                    // Margaery Tyrell (Core) has a reaction when a character enters play
                    // Battle of the Bells should prevent this
                    expect(this.player2).not.toAllowAbilityTrigger('Margaery Tyrell');
                });
            });
        });
    });

    integration(function () {
        describe('abilities that do not trigger on entering play', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('baratheon', [
                    'Battle of the Bells',
                    'Robert Baratheon (Core)'
                ]);
                const deck2 = this.buildDeck('stark', [
                    'A Noble Cause',
                    'Robb Stark (Core)',
                    'Sansa Stark (Core)'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.robert = this.player1.findCardByName('Robert Baratheon', 'hand');
                this.robb = this.player2.findCardByName('Robb Stark', 'hand');
                this.sansa = this.player2.findCardByName('Sansa Stark', 'hand');

                this.player1.clickCard(this.robert);
                this.player2.clickCard(this.robb);
                this.player2.dragCard(this.sansa, 'play area');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                // Kneel Robb so his ability has something to do (stand characters)
                this.robb.kneeled = true;

                // Initiate a military challenge to kill Sansa
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.robert);
                this.player1.clickPrompt('Done');

                this.skipActionWindow();

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                // Apply claim - kill Sansa
                this.player1.clickPrompt('Apply Claim');
                this.player2.clickCard(this.sansa);
            });

            it('should still allow abilities that trigger on other events', function () {
                // Robb's ability triggers on character death, not on entering play
                // It should still work
                expect(this.player2).toAllowAbilityTrigger('Robb Stark');
            });
        });
    });
});
