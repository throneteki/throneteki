describe('Leathers', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'Late Summer Feast',
                'Leathers',
                'Young Spearwife',
                'Mag the Mighty'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.leathers = this.player1.findCardByName('Leathers');
            this.wildling = this.player1.findCardByName('Young Spearwife');
            this.giant = this.player1.findCardByName('Mag the Mighty');
            this.player1.clickCard(this.wildling);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
        });

        describe('when Leathers is in play', function () {
            it('it should give a Wildling Character the thenightswatch affiliation', function () {
                expect(this.wildling.isFaction('thenightswatch')).toBe(false);
                this.player1.clickCard(this.leathers);
                expect(this.wildling.isFaction('thenightswatch')).toBe(true);
            });

            it('each giant character gains an intrigue icon', function () {
                this.player1.dragCard(this.giant, 'play area');
                expect(this.giant.hasIcon('Intrigue')).toBe(false);
                this.player1.clickCard(this.leathers);
                expect(this.giant.hasIcon('Intrigue')).toBe(true);
            });
        });
    });
});
