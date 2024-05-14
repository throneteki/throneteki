describe('Viserion (AtG)', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('targaryen', [
                'Marching Orders',
                'Viserion (AtG)',
                'Jhogo (TS)',
                'Aggo'
            ]);
            const deck2 = this.buildDeck('targaryen', [
                'Marching Orders',
                'Targaryen Loyalist',
                'Handmaiden'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.viserion = this.player1.findCardByName('Viserion (AtG)');
            this.jhogo = this.player1.findCardByName('Jhogo');
            this.aggo = this.player1.findCardByName('Aggo');
            this.chud1 = this.player2.findCardByName('Targaryen Loyalist');
            this.chud2 = this.player2.findCardByName('Handmaiden');
            this.player1.clickCard(this.jhogo);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.player1.clickCard(this.viserion);

            this.completeMarshalPhase();
        });

        describe('after participation in a winning challenge', function () {
            it('it should gain Intimidate if a card is discarded from hand', function () {
                this.unopposedChallenge(this.player1, 'Military', this.viserion);
                this.player1.triggerAbility('Viserion');
                this.player1.clickCard(this.aggo);

                expect(this.aggo.location).toBe('discard pile');
                expect(this.viserion.hasKeyword('Intimidate')).toBe(true);
            });

            it('it should not gain Intimidate if no card is discarded from hand', function () {
                this.unopposedChallenge(this.player1, 'Military', this.viserion);
                expect(this.viserion.hasKeyword('Intimidate')).toBe(false);
            });

            it('should allow to discard a card to gain Intimidate', function () {
                this.unopposedChallenge(this.player1, 'Military', this.viserion);
                expect(this.player1).toAllowAbilityTrigger('Viserion');
            });
        });
    });
});
