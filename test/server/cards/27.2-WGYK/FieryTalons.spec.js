describe('Fiery Talons', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('baratheon', [
                'A Noble Cause',
                'Fiery Talons (WGYK)',
                'Melisandre (Core)',
                'Hedge Knight'
            ]);
            const deck2 = this.buildDeck('baratheon', [
                'A Noble Cause',
                'Hedge Knight',
                'Old Forest Hunter (Core)'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.talons = this.player1.findCardByName('Fiery Talons', 'hand');
            this.melisandre = this.player1.findCardByName('Melisandre', 'hand');
            this.knight1 = this.player1.findCardByName('Hedge Knight', 'hand');
            this.p2knight = this.player2.findCardByName('Hedge Knight', 'hand');
            this.p2hunter = this.player2.findCardByName('Old Forest Hunter', 'hand');

            this.player1.clickCard(this.melisandre);
            this.player2.clickCard(this.p2knight);
            this.player2.clickCard(this.p2hunter);
            this.completeSetup();
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.knight1);
            this.completeMarshalPhase();
        });

        describe('during a Military challenge with a participating character', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.knight1);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickCard(this.p2knight);
                this.player2.clickCard(this.p2hunter);
                this.player2.clickPrompt('Done');
                // In defendersDeclared action window
                this.goldBefore = this.player1Object.gold;
            });

            it("should show the R'hllor kneel prompt when used", function () {
                this.player1.clickCard(this.talons);
                expect(this.player1).toHavePrompt('Select card to kneel');
            });

            it("should allow selecting Melisandre as the R'hllor kneel target", function () {
                this.player1.clickCard(this.talons);
                expect(this.player1).toAllowSelect(this.melisandre);
                expect(this.player1).not.toAllowSelect(this.knight1);
            });

            describe('after kneeling Melisandre and choosing target', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.talons);
                    this.player1.clickCard(this.melisandre);
                    this.player1.clickCard(this.p2knight);
                });

                it('should give the target -1 STR', function () {
                    expect(this.p2knight.getStrength()).toBe(this.p2knight.cardData.strength - 1);
                });

                it('should kneel Melisandre', function () {
                    expect(this.melisandre.kneeled).toBe(true);
                });

                it('should not cost any gold', function () {
                    expect(this.player1Object.gold).toBe(this.goldBefore);
                });
            });

            describe('when the target is reduced to 0 STR', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.talons);
                    this.player1.clickCard(this.melisandre);
                    this.player1.clickCard(this.p2hunter);
                });

                it('should place the target in shadows', function () {
                    expect(this.p2hunter.location).toBe('shadows');
                });
            });
        });
    });
});
