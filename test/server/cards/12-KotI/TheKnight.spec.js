describe('The Knight (KotI)', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('greyjoy', [
                'Marching Orders',
                'The Knight (KotI)',
                'Hedge Knight'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.knight = this.player1.findCardByName('The Knight');
            this.otherCharacter = this.player1.findCardByName('Hedge Knight');

            this.player1.clickCard(this.knight);
            this.player1.clickCard(this.otherCharacter);

            this.player2.clickCard('Hedge Knight');
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when attacking alone', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.knight);
                this.player1.clickPrompt('Done');
            });

            it('gains stealth and renown', function () {
                expect(this.knight.hasKeyword('Stealth')).toBe(true);
                expect(this.knight.hasKeyword('Renown')).toBe(true);
                expect(this.player1).toHavePrompt('Select stealth target for The Knight');
            });
        });

        describe('when not attacking alone', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.knight);
                this.player1.clickCard(this.otherCharacter);
                this.player1.clickPrompt('Done');
            });

            it('does not gains stealth and renown', function () {
                expect(this.knight.hasKeyword('Stealth')).toBe(false);
                expect(this.knight.hasKeyword('Renown')).toBe(false);
                expect(this.player1).not.toHavePrompt('Select stealth target for The Knight');
            });
        });
    });
});
