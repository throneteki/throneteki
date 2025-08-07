describe('Milkwater Crossing', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('thenightswatch', [
                'Late Summer Feast',
                'A Tourney for the King',
                'Milkwater Crossing',
                'Hedge Knight',
                'Nightmares'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.milkwaterCrossing = this.player1.findCardByName('Milkwater Crossing', 'hand');
            this.nightmares = this.player1.findCardByName('Nightmares', 'hand');
            this.knight = this.player2.findCardByName('Hedge Knight', 'hand');
            this.player1.clickCard(this.milkwaterCrossing);
            this.player2.clickCard(this.knight);

            this.completeSetup();
        });

        describe('when milkwater crossing is triggered', function () {
            beforeEach(function () {
                this.player1Object.gold = 1;
                this.player1.triggerAbility(this.milkwaterCrossing);
                this.player1.selectPlot('Late Summer Feast');
                this.player2.selectPlot('A Tourney for the King');
            });

            it('should remove all keywords from characters', function () {
                expect(this.knight.hasKeyword('Renown')).toBe(false);
            });

            it('should remove all immunity from characters', function () {
                this.player1.clickCard(this.nightmares);
                expect(this.player1).toAllowSelect(this.knight);
            });
        });
    });
});
