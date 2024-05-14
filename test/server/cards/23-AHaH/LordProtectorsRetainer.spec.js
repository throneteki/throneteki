describe("Lord Protector's Retainer", function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('martell', [
                'A Noble Cause',
                'Edric Dayne (HMW)',
                "Lord Protector's Retainer"
            ]);

            const deck2 = this.buildDeck('greyjoy', [
                'Filthy Accusations',
                'Victarion Greyjoy (LoCR)',
                'Maester Wendamyr'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.edric = this.player1.findCardByName('Edric Dayne', 'hand');
            this.retainer = this.player1.findCardByName("Lord Protector's Retainer", 'hand');
            this.victarion = this.player2.findCardByName('Victarion Greyjoy (LoCR)', 'hand');
            this.wendamyr = this.player2.findCardByName('Maester Wendamyr', 'hand');

            this.player1.clickCard(this.edric);
            this.player1.clickCard(this.retainer);
            this.player2.clickCard(this.victarion);
            this.player2.clickCard(this.wendamyr);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);
        });

        describe('when a plot when revealed targets a lord character', function () {
            beforeEach(function () {
                this.player2.clickCard(this.edric);
            });

            it("should prompt to trigger Lord Protector's Retainer", function () {
                expect(this.player1).toAllowAbilityTrigger("Lord Protector's Retainer");
            });

            describe("and when Lord Protector's Retainer is used to cancel the ability", function () {
                beforeEach(function () {
                    this.player1.triggerAbility("Lord Protector's Retainer");
                });

                it("should be returned to it's owners hand", function () {
                    expect(this.retainer.location).toBe('hand');
                });

                it('should cancel the plot when revealed', function () {
                    expect(this.edric.kneeled).toBe(false);
                });
            });
        });

        describe('when intimidate targets a lord character', function () {
            beforeEach(function () {
                this.player2.clickCard(this.edric);
                //pass plot cancel
                this.player1.clickPrompt('Pass');
                //stand edric back up
                this.player1.clickCard(this.edric);

                this.completeMarshalPhase();
                this.unopposedChallenge(this.player2, 'power', this.victarion);
                this.player2.clickPrompt('Apply Claim');
                this.player2.clickCard(this.edric);
            });

            it("should prompt to trigger Lord Protector's Retainer", function () {
                expect(this.player1).toAllowAbilityTrigger("Lord Protector's Retainer");
            });

            describe("and when Lord Protector's Retainer is used to cancel the ability", function () {
                beforeEach(function () {
                    this.player1.triggerAbility("Lord Protector's Retainer");
                });

                it('should cancel the intimidate keyword', function () {
                    expect(this.edric.kneeled).toBe(false);
                });
            });
        });

        describe('when stealth targets a lord character', function () {
            beforeEach(function () {
                this.player2.clickCard(this.edric);
                //pass plot cancel
                this.player1.clickPrompt('Pass');
                //stand edric back up
                this.player1.clickCard(this.edric);

                this.completeMarshalPhase();

                this.player2.clickPrompt('power');
                this.player2.clickCard(this.wendamyr, 'play area');
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.edric);
            });

            it("should prompt to trigger Lord Protector's Retainer", function () {
                expect(this.player1).toAllowAbilityTrigger("Lord Protector's Retainer");
            });

            describe("and when Lord Protector's Retainer is used to cancel the ability", function () {
                beforeEach(function () {
                    this.player1.triggerAbility("Lord Protector's Retainer");
                });

                it('should cancel the stealth keyword', function () {
                    expect(this.edric.bypassedByStealth).toBe(false);
                });
            });
        });
    });
});
