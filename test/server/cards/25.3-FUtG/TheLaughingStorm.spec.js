describe('The Laughing Storm', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'Heads on Spikes',
                'A Noble Cause',
                'Cersei Lannister (LoCR)'
            ]);
            const deck2 = this.buildDeck('baratheon', [
                'Taxation',
                'The Red Keep (Core)',
                'The Laughing Storm',
                'Bastard in Hiding',
                'Stannis Baratheon (Core)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.redKeep = this.player2.findCardByName('The Red Keep (Core)', 'hand');
            this.laughingStorm = this.player2.findCardByName('The Laughing Storm', 'hand');

            this.player1.clickCard('Cersei Lannister', 'hand');
            this.player2.clickCard(this.redKeep);
            this.player2.clickCard(this.laughingStorm);
            this.player2.clickCard('Bastard in Hiding', 'hand');

            this.completeSetup();

            this.player2.clickCard(this.laughingStorm, 'play area');
            this.player2.clickCard(this.redKeep);
        });

        describe('when the Laughing Storm is standing', function () {
            it('Heads on Spikes does not discard from hand', function () {
                this.player1.selectPlot('Heads on Spikes');
                this.selectFirstPlayer(this.player1);

                expect(this.player2Object.hand.length).toBe(1);
                expect(this.player2Object.deadPile.length).toBe(0);
            });

            it('intrigue challenge does not discard from hand', function () {
                this.cersei = this.player1.findCardByName('Cersei Lannister');
                this.player1.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);

                this.player1.clickPrompt('Apply Claim');

                expect(this.player2Object.hand.length).toBe(1);
                expect(this.player2Object.discardPile.length).toBe(0);
            });

            it('can be triggered to kneel a character', function () {
                this.cersei = this.player1.findCardByName('Cersei Lannister');
                this.bastard = this.player2.findCardByName('Bastard in Hiding');
                this.player1.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player2);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player2, 'Power', this.bastard);

                this.player2.triggerAbility('The Laughing Storm');
                this.player2.clickCard(this.cersei);

                expect(this.cersei.kneeled).toBe(true);
            });
        });

        describe('when the Laughing Storm is kneeling', function () {
            beforeEach(function () {
                this.laughingStorm.kneeled = true;
            });

            it('Heads on Spikes does discard from hand', function () {
                this.player1.selectPlot('Heads on Spikes');
                this.selectFirstPlayer(this.player1);

                expect(this.player2Object.hand.length).toBe(0);
                expect(this.player2Object.deadPile.length).toBe(1);
            });

            it('intrigue challenge does discard from hand', function () {
                this.cersei = this.player1.findCardByName('Cersei Lannister');
                this.player1.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);

                this.player1.clickPrompt('Apply Claim');

                expect(this.player2Object.hand.length).toBe(0);
                expect(this.player2Object.discardPile.length).toBe(1);
            });
        });
    });
});
