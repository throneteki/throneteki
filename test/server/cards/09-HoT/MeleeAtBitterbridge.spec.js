describe('Melee at Bitterbridge', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('tyrell', [
                'Trading with the Pentoshi',
                'Ser Jon Fossoway',
                'Melee at Bitterbridge',
                'Arbor Knight',
                'Arbor Knight'
            ]);

            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.fossoway = this.player1.findCardByName('Ser Jon Fossoway', 'hand');
            this.melee = this.player1.findCardByName('Melee at Bitterbridge', 'hand');
            [this.knight1, this.knight2] = this.player2.filterCardsByName('Arbor Knight', 'hand');

            this.player1.clickCard(this.fossoway);
            this.player2.clickCard(this.knight1);
            this.player2.clickCard(this.knight2);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);

            this.completeMarshalPhase();

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.fossoway);
            this.player1.clickPrompt('Done');
        });

        describe("when it's played with cost 1", function () {
            beforeEach(function () {
                this.player1.clickCard(this.melee);
                this.player1.selectValue('1');
                this.player1.clickCard(this.fossoway);
                this.player1.clickPrompt('Done');

                // Complete action window
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');

                this.player2.clickPrompt('Done');

                this.skipActionWindow();

                this.player1.clickPrompt('Continue');
            });

            it('should give renown', function () {
                expect(this.fossoway.power).toBe(1);
            });
        });

        describe("when it's played with cost higher than 1", function () {
            beforeEach(function () {
                this.skipActionWindow();

                this.player2.clickCard(this.knight1);
                this.player2.clickCard(this.knight2);
                this.player2.clickPrompt('Done');

                this.player1.clickCard(this.melee);
                this.player1.selectValue('3');
                this.player1.clickCard(this.fossoway);
                this.player1.clickCard(this.knight1);
                this.player1.clickCard(this.knight2);
                this.player1.clickPrompt('Done');

                // Complete action window
                this.player2.clickPrompt('Pass');
                this.player1.clickPrompt('Pass');

                this.player1.clickPrompt('Continue');
            });

            it('should give renown to the highest strength character(s) and have the others not contribute strength', function () {
                expect(this.player1Object.faction.power).toBe(1);
                expect(this.fossoway.power).toBe(1);
            });
        });
    });
});
