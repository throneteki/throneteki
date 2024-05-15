describe('Recruiter for the Watch', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('thenightswatch', [
                'Trading with the Pentoshi',
                'Recruiter for the Watch',
                'Dragonstone Faithful',
                'Nightmares',
                'Yoren (Core)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.recruiter = this.player1.findCardByName('Recruiter for the Watch', 'hand');
            this.character = this.player2.findCardByName('Dragonstone Faithful', 'hand');
            this.nightmares = this.player2.findCardByName('Nightmares', 'hand');

            this.player1.clickCard(this.recruiter);
            this.player2.clickCard(this.character);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickMenu(this.recruiter, 'Take control of character');
            this.player1.clickCard(this.character);
        });

        it('should kneel the Recruiter', function () {
            expect(this.recruiter.kneeled).toBe(true);
        });

        it('should take control of the selected character', function () {
            expect(this.character.controller.name).toBe(this.player1Object.name);
        });

        describe('when the Recruiter stands', function () {
            beforeEach(function () {
                this.completeMarshalPhase();
                this.completeChallengesPhase();

                expect(this.player1).toHavePrompt('Select optional cards to stand');
                this.player1.clickCard(this.recruiter);
                this.player1.clickPrompt('Done');
            });

            it('should revert control of the selected character', function () {
                expect(this.character.controller.name).toBe(this.player2Object.name);
            });
        });

        describe('when the Recruiter leaves play', function () {
            beforeEach(function () {
                this.player1.dragCard(this.recruiter, 'discard pile');
            });

            it('should revert control of the selected character', function () {
                expect(this.character.controller.name).toBe(this.player2Object.name);
            });
        });

        describe('when the Recruiter is blanked', function () {
            beforeEach(function () {
                this.player2.clickCard(this.nightmares);
                this.player2.clickCard(this.recruiter);
            });

            it('should not modify control of the character', function () {
                expect(this.character.controller.name).toBe(this.player1Object.name);
            });
        });

        describe('when the card leaves play and is taken control of again', function () {
            beforeEach(function () {
                // Manually discard the controlled character
                this.player1.dragCard(this.character, 'discard pile');

                // Take control of the character again
                this.player1.clickCard('Yoren', 'hand');
                this.player1.triggerAbility('Yoren');
                this.player1.clickCard(this.character);

                expect(this.character.location).toBe('play area');
                expect(this.character).toBeControlledBy(this.player1);

                // Stand the Recruiter to end its effect
                this.player1.clickCard(this.recruiter);
            });

            it('should not return control', function () {
                expect(this.character.location).toBe('play area');
                expect(this.character).toBeControlledBy(this.player1);
            });
        });
    });
});
