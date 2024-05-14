describe('Citadel Archivist (KotI)', function () {
    integration(function () {
        describe('vs Heads on Spikes', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    'A Noble Cause',
                    { name: 'Citadel Archivist', count: 20 }
                ]);
                const deck2 = this.buildDeck('greyjoy', [
                    'Heads on Spikes',
                    'A Noble Cause',
                    'Hedge Knight'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.completeSetup();
            });

            describe('when killed by Spikes', function () {
                beforeEach(function () {
                    this.player1.selectPlot('A Noble Cause');
                    this.player2.selectPlot('Heads on Spikes');
                    this.selectFirstPlayer(this.player1);
                });

                it('does not allow Archivist to trigger', function () {
                    expect(this.player1).not.toAllowAbilityTrigger('Citadel Archivist');
                });
            });
        });

        describe('vs Corpse Lake', function () {
            beforeEach(function () {
                const deck1 = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    { name: 'Citadel Archivist', count: 20 }
                ]);
                const deck2 = this.buildDeck('greyjoy', [
                    'A Noble Cause',
                    'Orkmont Reaver',
                    'Corpse Lake'
                ]);
                this.player1.selectDeck(deck1);
                this.player2.selectDeck(deck2);
                this.startGame();
                this.keepStartingHands();

                this.pillageChar = this.player2.findCardByName('Orkmont Reaver');
                this.corpseLake = this.player2.findCardByName('Corpse Lake');

                this.player2.clickCard(this.pillageChar);
                this.player2.clickCard(this.corpseLake);

                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
            });

            describe('when triggered after pillage', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Done');

                    this.unopposedChallenge(this.player2, 'Military', this.pillageChar);
                    this.player2.clickPrompt('Apply Claim');
                    this.player1.clickPrompt('Done');
                    this.player1.triggerAbility('Citadel Archivist');
                });

                it('allows Corpse Lake to trigger', function () {
                    expect(this.player2).toAllowAbilityTrigger(this.corpseLake);
                });
            });
        });
    });
});
