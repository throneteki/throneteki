describe('Manual stat editing', function () {
    integration(function () {
        describe('by plot stat buttons', function () {
            beforeEach(function () {
                let deck = this.buildDeck('stark', [
                    'Desperate Attack',
                    "Lysa's Letter",
                    'Tumblestone Knight'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);

                this.startGame();
                this.keepStartingHands();

                this.knight = this.player1.findCardByName('Tumblestone Knight', 'hand');
                this.letter = this.player1.findCardByName("Lysa's Letter", 'hand');

                this.player1.clickCard(this.knight);
                this.completeSetup();

                this.selectFirstPlayer(this.player1);

                this.completeMarshalPhase();
                this.player1.clickCard(this.letter);
                this.player1.clickPrompt(this.player2.name);
                this.player1.clickPrompt('Power');
                this.player2.clickPrompt('pass');
            });

            it('should change a claim value that is not modified', function () {
                expect(this.player1Object.getClaim()).toBe(3);
                this.game.changeStat(this.player1Object.name, 'claim', -1);
                expect(this.player1Object.getClaim()).toBe(2);
            });

            it('should change a claim value that has been set', function () {
                expect(this.player2Object.getClaim()).toBe(0);
                this.game.changeStat(this.player2Object.name, 'claim', 1);
                expect(this.player2Object.getClaim()).toBe(1);
            });

            it('should change a claim value that has a modifier applied', function () {
                this.player1.clickPrompt('Power');
                this.player1.clickCard(this.knight);
                this.player1.clickPrompt('Done');
                expect(this.player1Object.getClaim()).toBe(4);
                this.game.changeStat(this.player1Object.name, 'claim', 1);
                expect(this.player1Object.getClaim()).toBe(5);
            });
        });

        describe('by chat commands', function () {
            beforeEach(function () {
                let deck = this.buildDeck('stark', [
                    'At the Palace of Sorrows (R)',
                    'A Noble Cause',
                    'A Song of Summer',
                    'Needle',
                    'Tumblestone Knight'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);

                this.startGame();
                this.keepStartingHands();

                this.knight = this.player1.findCardByName('Tumblestone Knight', 'hand');
                this.needle = this.player1.findCardByName('Needle', 'hand');
                this.song = this.player1.findCardByName('A Song of Summer', 'plot deck');
                this.palace1 = this.player1.findCardByName(
                    'At the Palace of Sorrows (R)',
                    'plot deck'
                );
                this.cause1 = this.player1.findCardByName('A Noble Cause', 'plot deck');
                this.palace2 = this.player2.findCardByName(
                    'At the Palace of Sorrows (R)',
                    'plot deck'
                );
                this.cause2 = this.player2.findCardByName('A Noble Cause', 'plot deck');

                this.player1.clickCard(this.knight);
                this.completeSetup();
            });

            it('should change a strength value that is not modified', function () {
                this.player1.selectPlot(this.cause1);
                this.player2.selectPlot(this.cause2);
                this.selectFirstPlayer(this.player1);
                expect(this.knight.getStrength()).toBe(2);
                this.completeMarshalPhase();
                this.player1.sendChat('/strength 1');
                expect(this.player1.hasPrompt('Select a card to set strength for')).toBe(true);
                this.player1.clickCard(this.knight);
                expect(this.knight.getStrength()).toBe(1);
            });

            it('should change a strength value that has been set', function () {
                this.player1.selectPlot(this.palace1);
                this.player2.selectPlot(this.cause2);
                this.selectFirstPlayer(this.player1);
                expect(this.knight.getStrength()).toBe(3);
                this.completeMarshalPhase();
                this.player1.sendChat('/strength 4');
                this.player1.clickCard(this.knight);
                expect(this.knight.getStrength()).toBe(4);
            });

            it('should change a strength value that has a modifier applied', function () {
                this.player1.selectPlot(this.song);
                this.player2.selectPlot(this.cause2);
                this.selectFirstPlayer(this.player1);
                expect(this.knight.getStrength()).toBe(3);
                this.player1.sendChat('/strength 6');
                expect(this.player1.hasPrompt('Select a card to set strength for')).toBe(true);
                this.player1.clickCard(this.knight);
                expect(this.knight.getStrength()).toBe(6);
            });
        });
    });
});
