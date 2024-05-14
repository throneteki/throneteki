describe('Cersei Lannister (LoCR)', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('lannister', [
                'Sneak Attack',
                'A Clash of Kings',
                'Heads on Spikes',
                'Cersei Lannister (LoCR)'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'Sneak Attack',
                'Hedge Knight',
                'Hedge Knight',
                'Missandei'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player1.clickCard('Cersei Lannister', 'hand');
            [this.hedge1, this.hedge2] = this.player2.filterCardsByName('Hedge Knight', 'hand');
            this.missandei = this.player2.findCardByName('Missandei');
            //hide missandei in dead pile for later test
            this.player2.dragCard(this.missandei, 'dead pile');
            this.completeSetup();
        });

        describe('when opponent hand cards are discarded', function () {
            describe('when a single card is discarded via claim', function () {
                beforeEach(function () {
                    this.cersei = this.player1.findCardByName('Cersei Lannister');

                    this.player1.selectPlot('A Clash of Kings');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);

                    this.player1.clickPrompt('Apply Claim');
                });

                it('should allow Cersei to gain power', function () {
                    this.player1.triggerAbility('Cersei Lannister');
                    expect(this.cersei.power).toBe(1);
                });
            });

            describe('when a multiple cards are discarded via claim', function () {
                beforeEach(function () {
                    this.cersei = this.player1.findCardByName('Cersei Lannister');

                    this.player1.selectPlot('Sneak Attack');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);

                    this.player1.clickPrompt('Apply Claim');
                    // Skip order prompt
                    this.player2.clickPrompt('Done');
                });

                it('should not prompt Cersei to gain power twice', function () {
                    this.player1.triggerAbility('Cersei Lannister');

                    expect(this.player1).not.toAllowAbilityTrigger('Cersei Lannister');
                });
            });

            describe('when a single card is discarded via other means', function () {
                beforeEach(function () {
                    this.cersei = this.player1.findCardByName('Cersei Lannister');

                    this.player1.selectPlot('Heads on Spikes');
                    this.selectFirstPlayer(this.player1);
                });

                it('should allow Cersei to gain power', function () {
                    this.player1.triggerAbility('Cersei Lannister');
                    expect(this.cersei.power).toBe(1);
                });
            });

            describe('when a card with an interrupt replacement handler is discarded', function () {
                beforeEach(function () {
                    this.cersei = this.player1.findCardByName('Cersei Lannister');
                    this.player2.dragCard(this.hedge1, 'dead pile');
                    this.player2.dragCard(this.hedge2, 'dead pile');
                    this.player2.dragCard(this.missandei, 'hand');

                    this.player1.selectPlot('A Clash of Kings');
                    this.selectFirstPlayer(this.player1);

                    this.completeMarshalPhase();

                    this.unopposedChallenge(this.player1, 'Intrigue', this.cersei);

                    this.player1.clickPrompt('Apply Claim');
                });

                it('should allow Cersei to gain power AND NOT CRASH THE GAME', function () {
                    expect(this.player2).toAllowAbilityTrigger('Missandei');
                    this.player2.triggerAbility('Missandei');
                    expect(this.missandei.location).toBe('play area');
                    expect(this.player1).toAllowAbilityTrigger('Cersei Lannister');
                    this.player1.triggerAbility('Cersei Lannister');
                    expect(this.cersei.power).toBe(1);
                });
            });
        });
    });
});
