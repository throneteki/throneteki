describe('Mhysa', function () {
    integration({ numOfPlayers: 1 }, function () {
        describe('when attacking in a power challenge', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'Sailing the Summer Sea',
                    'Daenerys Targaryen (TFM)',
                    'Viserys Targaryen (Core)',
                    'Mhysa'
                ]);
                this.player1.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.mhysa = this.player1.findCardByName('Mhysa', 'hand');
                this.mhysaChar = this.player1.findCardByName('Daenerys Targaryen', 'hand');
                this.attackingChar = this.player1.findCardByName('Viserys Targaryen', 'hand');

                this.player1.clickCard(this.mhysa);
                this.player1.clickCard(this.mhysaChar);
                this.player1.clickCard(this.attackingChar);

                this.completeSetup();

                // Place attachments
                this.player1.clickCard(this.mhysa);
                this.player1.clickCard(this.mhysaChar);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.mhysaChar);
                this.player1.clickCard(this.attackingChar);
                this.player1.clickPrompt('Done');
            });

            it("increases the attached character's strength", function () {
                // 3 base STR + 2 attacking chars
                expect(this.mhysaChar.kneeled).toBe(false);
                expect(this.mhysaChar.getStrength()).toBe(5);
            });

            it("does not increase the attached character's strength for a second challenge", function () {
                this.skipActionWindow();
                this.skipActionWindow();

                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.mhysaChar);
                this.player1.clickPrompt('Done');

                expect(this.mhysaChar.kneeled).toBe(true);
                expect(this.mhysaChar.getStrength()).toBe(3);
            });
        });

        describe('when attacking in a non-power challenge', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'A Noble Cause',
                    'Daenerys Targaryen (TFM)',
                    'Viserys Targaryen (Core)',
                    'Mhysa'
                ]);
                this.player1.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.mhysa = this.player1.findCardByName('Mhysa', 'hand');
                this.mhysaChar = this.player1.findCardByName('Daenerys Targaryen', 'hand');
                this.attackingChar = this.player1.findCardByName('Viserys Targaryen', 'hand');

                this.player1.clickCard(this.mhysa);
                this.player1.clickCard(this.mhysaChar);
                this.player1.clickCard(this.attackingChar);

                this.completeSetup();

                // Place attachments
                this.player1.clickCard(this.mhysa);
                this.player1.clickCard(this.mhysaChar);

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();

                //make a power challenge first
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.mhysaChar);
                this.player1.clickCard(this.attackingChar);
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.skipActionWindow();

                this.player1.clickPrompt('Intrigue');
                this.player1.clickCard(this.mhysaChar);
                this.player1.clickCard(this.attackingChar);
                this.player1.clickPrompt('Done');
            });

            it("does not increase the attached character's strength", function () {
                expect(this.mhysaChar.kneeled).toBe(true);
                expect(this.mhysaChar.getStrength()).toBe(3);
            });
        });
    });
});
