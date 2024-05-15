describe('AlysaneMormont', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('stark', [
                'Marching Orders',
                'Alysane Mormont',
                'Bran Stark (Core)',
                'Rickon Stark'
            ]);
            const deck2 = this.buildDeck('stark', [
                'Marching Orders',
                'Alysane Mormont',
                'Bran Stark (Core)',
                'Hot Pie'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.alysaneMormont1 = this.player1.findCardByName('Alysane Mormont');
            this.bran1 = this.player1.findCardByName('Bran Stark (Core)');
            this.rickon = this.player1.findCardByName('Rickon Stark');
            this.alysaneMormont2 = this.player2.findCardByName('Alysane Mormont');
            this.bran2 = this.player2.findCardByName('Bran Stark (Core)');
            this.hotpie = this.player2.findCardByName('Hot Pie');

            this.player1.clickCard(this.alysaneMormont1);
            this.player1.clickCard(this.bran1);
            this.player1.clickCard(this.rickon);

            this.player2.clickCard(this.alysaneMormont2);
            this.player2.clickCard(this.bran2);
            this.player2.clickCard(this.hotpie);
            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when attacking military with only stark characters', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.alysaneMormont1);
                this.player1.clickPrompt('Done');
            });

            it('gains stealth and does not kneel as attacker', function () {
                expect(this.alysaneMormont1.hasKeyword('Stealth')).toBe(true);
                expect(this.alysaneMormont1.kneeled).toBe(false);
            });
        });

        describe('when attacking military with not only stark characters', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('Military');
                this.player2.clickCard(this.alysaneMormont2);
                this.player2.clickPrompt('Done');
            });

            it('does not gains stealth and does kneel as attacker', function () {
                expect(this.alysaneMormont2.hasKeyword('Stealth')).toBe(false);
                expect(this.alysaneMormont2.kneeled).toBe(true);
            });
        });
    });
});
