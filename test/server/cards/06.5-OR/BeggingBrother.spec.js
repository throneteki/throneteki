describe('Begging Brother', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('tyrell', [
                'Trading with the Pentoshi',
                'Begging Brother',
                'Tanda Stokeworth',
                'House Florent Knight'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.brother = this.player1.findCardByName('Begging Brother', 'hand');
            this.tanda1 = this.player1.findCardByName('Tanda Stokeworth', 'hand');
            this.knight = this.player1.findCardByName('House Florent Knight', 'hand');
            this.tanda2 = this.player2.findCardByName('Tanda Stokeworth', 'hand');

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.player1.clickCard(this.brother);
            this.player1.clickPrompt('2');
        });

        describe('when you trigger a non-forced character ability', function () {
            beforeEach(function () {
                this.player1.clickCard(this.tanda1);
                this.player1.triggerAbility('Tanda Stokeworth');
            });

            it('should not prompt to trigger Begging Brother', function () {
                expect(this.player1).not.toAllowAbilityTrigger('Begging Brother');
            });

            it('should resolve as expected', function () {
                expect(this.player1Object.gold).toBe(8);
            });
        });

        describe('when you trigger a forced character ability', function () {
            beforeEach(function () {
                this.player1.clickCard(this.knight);
                this.player1.clickCard(this.knight);
            });

            it('should prompt to trigger Begging Brother', function () {
                expect(this.player1).toAllowAbilityTrigger('Begging Brother');
            });

            describe('and Begging Brother is used to cancel the ability', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Begging Brother');
                });

                it('should discard a gold from Begging Brother to pay for the ability', function () {
                    expect(this.brother.tokens.gold).toBe(1);
                });

                it('should cancel the resolution of the character ability', function () {
                    expect(this.knight.location).toBe('play area');
                });
            });
        });

        describe('when an opponent triggers a character ability', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.tanda2);
                this.player2.triggerAbility('Tanda Stokeworth');
            });

            it('should prompt to trigger Begging Brother', function () {
                expect(this.player1).toAllowAbilityTrigger('Begging Brother');
            });

            describe('and Begging Brother is used to cancel the ability', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Begging Brother');
                });

                it('should discard a gold from Begging Brother to pay for the ability', function () {
                    expect(this.brother.tokens.gold).toBe(1);
                });

                it('should cancel the resolution of the character ability', function () {
                    expect(this.player2Object.gold).toBe(10);
                });
            });
        });
    });
});
