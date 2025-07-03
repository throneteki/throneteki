describe('plot phase', function () {
    integration(function () {
        describe('when revealing two plots with persistent effects', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'Blood of the Dragon',
                    'A Song of Summer',
                    'Targaryen Loyalist'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.chud = this.player2.findCardByName('Targaryen Loyalist', 'hand');
                this.player2.clickCard(this.chud);

                this.completeSetup();

                this.player1.selectPlot('Blood of the Dragon');
                this.player2.selectPlot('A Song of Summer');
            });

            it('should apply effects simultaneously', function () {
                // Since Blood of the Dragon and A Song of Summer are applied
                // simultaneously, the chud should survive.
                expect(this.chud.location).toBe('play area');
            });
        });

        describe('when a new plot is revealed', function () {
            beforeEach(function () {
                const deck = this.buildDeck('targaryen', [
                    'A Song of Summer',
                    'A Noble Cause',
                    'A Noble Cause',
                    'Targaryen Loyalist'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.character = this.player1.findCardByName('Targaryen Loyalist', 'hand');
                this.player1.clickCard(this.character);

                this.completeSetup();

                this.player1.selectPlot('A Song of Summer');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);

                expect(this.character.getStrength()).toBe(2);

                this.completeMarshalPhase();
                this.completeChallengesPhase();

                this.player1.selectPlot('A Noble Cause');
                this.player2.selectPlot('A Noble Cause');
                this.selectFirstPlayer(this.player1);
            });

            it('should unapply the effects of the plot', function () {
                expect(this.character.getStrength()).toBe(1);
            });
        });

        describe('when the last plot is revealed', function () {
            beforeEach(function () {
                const deck = this.buildDeck('tyrell', [
                    'A Noble Cause',
                    'Calm Over Westeros',
                    'A Song of Summer',
                    'The Winds of Winter',
                    'A Feast for Crows',
                    'Bitterbridge Encampment',
                    'Bitterbridge Encampment',
                    'Bitterbridge Encampment',
                    'Bitterbridge Encampment',
                    'Bitterbridge Encampment',
                    'Bitterbridge Encampment',
                    'Starfall Cavalry',
                    'Starfall Cavalry',
                    'Starfall Cavalry',
                    'Starfall Cavalry',
                    'Starfall Cavalry',
                    'Starfall Cavalry'
                ]);
                //6 bitterbridge encampments and 6 starfall cavalry ensures at least one of each in the starting hand  and more than the maximum draw for a starfall cavalry in deck after setting up bitterbridge
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.p2bitterbridge = this.player2.findCardByName(
                    'Bitterbridge Encampment',
                    'hand'
                );
                this.p1noble = this.player1.findCardByName('A Noble Cause', 'plot deck');
                this.p2noble = this.player2.findCardByName('A Noble Cause', 'plot deck');
                this.p1summer = this.player1.findCardByName('A Song of Summer', 'plot deck');
                this.p2summer = this.player2.findCardByName('A Song of Summer', 'plot deck');
                this.p1winter = this.player1.findCardByName('The Winds of Winter', 'plot deck');
                this.p2winter = this.player2.findCardByName('The Winds of Winter', 'plot deck');
                this.p1feast = this.player1.findCardByName('A Feast for Crows', 'plot deck');
                this.p2feast = this.player2.findCardByName('A Feast for Crows', 'plot deck');

                this.p1StarfallCav = this.player1.findCardByName('Starfall Cavalry', 'hand');
                this.p2StarfallCav = this.player2.findCardByName('Starfall Cavalry', 'hand');
                this.player2.clickCard(this.p2bitterbridge);
                this.completeSetup();
                this.player1.dragCard(this.p1noble, 'revealed plots');
                this.player1.dragCard(this.p1summer, 'revealed plots');
                this.player1.dragCard(this.p1winter, 'revealed plots');
                this.player1.dragCard(this.p1feast, 'revealed plots');
                //p1 has 4 plots in used pile, 1 in deck
                this.player2.selectPlot(this.p2noble);
                this.selectFirstPlayer(this.player1);
            });

            it('should have plots in the revealed pile when prompting players for When Revealed effects', function () {
                expect(this.player1.hasPrompt('Select a challenge type')).toBe(true);
                expect(this.player1Object.getNumberOfUsedPlots()).toBe(4);
            });

            it('should have no plots in the revealed pile when prompting players for reactions to revealing plots', function () {
                this.player1.clickPrompt('Military');
                expect(this.player2).toAllowSelect(this.p2bitterbridge);
                expect(this.player1Object.getNumberOfUsedPlots()).toBe(0);
                this.player2.clickCard(this.p2bitterbridge);
                this.player1.clickCard(this.p1StarfallCav);
                this.player2.clickCard(this.p2StarfallCav);
                //player2 has to handle bitterbridge prompt before player1's starfall cavalry prompt appears
                this.player1.clickCard(this.p1StarfallCav);
                expect(this.player1.filterCards((card) => card.location === 'hand').length).toBe(7);
                //7 from game start - 1 putting starfall cavalry into play + 1 from Starfall cavalry's enter play reaction with fewer than 3 used plots
            });
        });
    });
});
