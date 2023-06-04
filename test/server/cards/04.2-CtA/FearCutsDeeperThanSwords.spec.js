describe('Fear Cuts Deeper Than Swords', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Tumblestone Knight', 'Fear Cuts Deeper Than Swords'
            ]);

            const deck2 = this.buildDeck('tyrell', [
                'Filthy Accusations',
                'Victarion Greyjoy (LoCR)',
                'Maester Wendamyr'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.knight = this.player1.findCardByName('Tumblestone Knight', 'hand');
            this.victarion = this.player2.findCardByName('Victarion Greyjoy (LoCR)', 'hand');
            this.wendamyr = this.player2.findCardByName('Maester Wendamyr', 'hand');

            this.player1.clickCard(this.knight);
            this.player2.clickCard(this.victarion);
            this.player2.clickCard(this.wendamyr);

            this.completeSetup();

            this.selectFirstPlayer(this.player2);
        });

        describe('when a plot when revealed targets a stark character', function () {
            beforeEach(function () {
                this.player1Object.gold = 2;
                this.player2.clickCard(this.knight);
            });

            it('should prompt to trigger fear cuts', function () {
                expect(this.player1).toAllowAbilityTrigger('Fear Cuts Deeper Than Swords');
            });

            describe('and when fear cuts is used to cancel the ability', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Fear Cuts Deeper Than Swords');
                });

                it('should cancel the plot when revealed', function () {
                    expect(this.knight.kneeled).toBe(false);
                });
            });
        });

        describe('when intimidate targets a stark character', function () {
            beforeEach(function () {
                this.player2.clickCard(this.knight);
                //stand the knight back up
                this.player1.clickCard(this.knight);

                this.completeMarshalPhase();
                this.unopposedChallenge(this.player2, 'power', this.victarion);
                this.player2.clickPrompt('Apply Claim');
                this.player2.clickCard(this.knight);
            });

            it('should prompt to trigger fear cuts', function () {
                expect(this.player1).toAllowAbilityTrigger('Fear Cuts Deeper Than Swords');
            });

            describe('and when fear cuts is used to cancel the ability', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Fear Cuts Deeper Than Swords');
                });

                it('should cancel the intimidate keyword', function () {
                    expect(this.knight.kneeled).toBe(false);
                });
            });
        });

        describe('when stealth targets a stark character', function () {
            beforeEach(function () {
                this.player2.clickCard(this.knight);
                //stand the knight back up
                this.player1.clickCard(this.knight);

                this.completeMarshalPhase();
                
                this.player2.clickPrompt('power');
                this.player2.clickCard(this.wendamyr, 'play area');
                this.player2.clickPrompt('Done');
                this.player2.clickCard(this.knight);
            });

            it('should prompt to trigger fear cuts', function () {
                expect(this.player1).toAllowAbilityTrigger('Fear Cuts Deeper Than Swords');
            });

            describe('and when fear cuts is used to cancel the ability', function () {
                beforeEach(function () {
                    this.player1.triggerAbility('Fear Cuts Deeper Than Swords');
                });

                it('should cancel the stealth keyword', function () {
                    expect(this.knight.bypassedByStealth).toBe(false);
                });
            });
        });
    });
});
