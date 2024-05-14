describe('Jhogo (TS)', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('targaryen', ['Marching Orders', 'Jhogo (TS)', 'Aggo']);
            const deck2 = this.buildDeck('targaryen', [
                'Marching Orders',
                'Targaryen Loyalist',
                'Handmaiden'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.jhogo = this.player1.findCardByName('Jhogo');
            this.aggo = this.player1.findCardByName('Aggo');
            this.chud1 = this.player2.findCardByName('Targaryen Loyalist');
            this.chud2 = this.player2.findCardByName('Handmaiden');
            this.player1.clickCard(this.jhogo);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.player1.clickCard(this.aggo);

            this.completeMarshalPhase();

            this.player2.dragCard(this.chud1, 'dead pile');
            this.player2.dragCard(this.chud2, 'dead pile');

            expect(this.player2Object.deadPile.length).toBe(2);
        });

        describe('when attacking', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.jhogo);
                this.player1.clickPrompt('Done');
            });

            it('get strength boosted by the number of opponent dead characters', function () {
                expect(this.jhogo.getStrength()).toBe(5);
            });

            it('gains stealth if you control another bloodrider', function () {
                expect(this.jhogo.hasKeyword('Stealth')).toBe(true);
            });
        });
    });
});
