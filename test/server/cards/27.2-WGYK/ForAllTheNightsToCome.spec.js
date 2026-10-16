describe('For All the Nights to Come', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('thenightswatch', [
                'A Noble Cause',
                'For All the Nights to Come (WGYK)',
                'Old Bear Mormont (Core)',
                'Steward at the Wall',
                'Veteran Builder',
                'Old Forest Hunter',
                'Great Ranging (FtR)'
            ]);
            const deck2 = this.buildDeck('targaryen', ['A Noble Cause', 'Hedge Knight']);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();
            this.completeSetup();
            this.selectFirstPlayer(this.player1);

            this.shields = this.player1.findCardByName('For All the Nights to Come', 'hand');
            this.oldBear = this.player1.findCardByName('Old Bear Mormont', 'hand');
            this.steward = this.player1.findCardByName('Steward at the Wall', 'hand');
            this.builder = this.player1.findCardByName('Veteran Builder', 'hand');
            this.ranger = this.player1.findCardByName('Old Forest Hunter', 'hand');

            this.player1Object.gold = 20;
            this.player1.clickCard(this.oldBear);
            this.player1.clickCard(this.steward);
            this.player1.clickCard(this.builder);
            this.player1.clickCard(this.ranger);
            this.completeMarshalPhase();
        });

        describe('when the player wins a challenge by 5 or more STR', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Military', this.oldBear);
            });

            it('should allow triggering the reaction', function () {
                expect(this.player1).toAllowAbilityTrigger(this.shields);
            });

            describe('when the reaction is used', function () {
                beforeEach(function () {
                    this.player1.triggerAbility(this.shields);
                    this.player1.clickCard(this.builder);
                    this.player1.clickCard(this.ranger);
                    this.player1.clickCard(this.steward);
                });

                it('should give the builder 1 power', function () {
                    expect(this.builder.getPower()).toBe(1);
                });

                it('should give the ranger 1 power', function () {
                    expect(this.ranger.getPower()).toBe(1);
                });

                it('should give the steward 1 power', function () {
                    expect(this.steward.getPower()).toBe(1);
                });
            });
        });

        describe('when one character fills multiple trait slots', function () {
            beforeEach(function () {
                this.greatRanging = this.player1.findCardByName('Great Ranging', 'hand');
                this.player1.dragCard(this.greatRanging, 'play area');
                this.player1.dragCard(this.steward, 'discard pile');
                this.player1.dragCard(this.ranger, 'discard pile');

                this.unopposedChallenge(this.player1, 'Military', this.oldBear);
            });

            it('should allow triggering the reaction', function () {
                expect(this.player1).toAllowAbilityTrigger(this.shields);
            });

            describe('when the reaction is used', function () {
                beforeEach(function () {
                    this.player1.triggerAbility(this.shields);
                    this.player1.clickCard(this.builder);
                    this.player1.clickCard(this.greatRanging);
                    this.player1.clickCard(this.greatRanging);
                });

                it('should only give that character 1 power', function () {
                    expect(this.greatRanging.getPower()).toBe(1);
                });

                it('should give the other character 1 power', function () {
                    expect(this.builder.getPower()).toBe(1);
                });
            });
        });

        describe('when the player wins a challenge by less than 5 STR', function () {
            beforeEach(function () {
                this.unopposedChallenge(this.player1, 'Intrigue', this.steward);
            });

            it('should not allow triggering the reaction', function () {
                expect(this.player1).not.toAllowAbilityTrigger(this.shields);
            });
        });
    });
});
