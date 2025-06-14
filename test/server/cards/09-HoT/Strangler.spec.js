describe('Strangler', function () {
    integration(function () {
        beforeEach(function () {
            const tyrell = this.buildDeck('tyrell', [
                'Trading with the Pentoshi',
                'Randyll Tarly (Core)',
                'The Roseroad',
                'Lady Forlorn',
                'Strangler'
            ]);
            const targ = this.buildDeck('targaryen', [
                'At the Palace of Sorrows (R)',
                'Trading with the Pentoshi',
                'Crown of Gold (R)',
                'Daenerys Targaryen (TFM)',
                'Visited by Shadows',
                'Shadow of the East'
            ]);
            this.player1.selectDeck(tyrell);
            this.player2.selectDeck(targ);
            this.startGame();
            this.keepStartingHands();

            this.p1Pentoshi = this.player1.findCardByName('Trading with the Pentoshi', 'plot deck');
            this.p2Pentoshi = this.player2.findCardByName('Trading with the Pentoshi', 'plot deck');
            this.randyll = this.player1.findCardByName('Randyll Tarly (Core)', 'hand');
            this.roseroad = this.player1.findCardByName('The Roseroad', 'hand');
            this.forlorn = this.player1.findCardByName('Lady Forlorn', 'hand');
            this.strangler = this.player1.findCardByName('Strangler', 'hand');

            this.palace = this.player2.findCardByName('At the Palace of Sorrows (R)', 'plot deck');
            this.crown = this.player2.findCardByName('Crown of Gold (R)', 'hand');
            this.dany = this.player2.findCardByName('Daenerys Targaryen (TFM)', 'hand');
            this.shadows = this.player2.findCardByName('Visited by Shadows', 'hand');
            this.east = this.player2.findCardByName('Shadow of the East', 'hand');

            this.player1.clickCard(this.randyll);
            this.player1.clickCard(this.roseroad);

            this.player2.clickCard(this.dany);
            this.player2.clickCard(this.east);
        });

        it('should not cause Daenerys (TFM) to become weaker', function () {
            this.completeSetup();
            this.player2.selectPlot(this.p2Pentoshi);
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.strangler);
            this.player1.clickCard(this.dany);
            this.completeMarshalPhase();

            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Power');
            this.player2.clickCard(this.dany);
            this.player2.clickPrompt('Done');
            expect(this.dany.getStrength()).toBe(3);
        });

        it('should take precedence over At the Palace of Sorrows as a later effect, even if the card was put into play earlier', function () {
            this.player1.clickCard(this.strangler);
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.clickCard(this.strangler);
            this.player1.clickCard(this.randyll);

            this.player2.selectPlot(this.palace);
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            expect(this.randyll.getStrength()).toBe(3);
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            expect(this.randyll.getStrength()).toBe(1);
        });

        it('should count as raising strength for the purposes of eg standing Randyll when his strength is 0', function () {
            this.completeSetup();
            this.player2.selectPlot(this.p2Pentoshi);
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.strangler);
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.crown);
            this.player2.clickCard(this.randyll);
            this.player2.clickCard(this.shadows);
            this.player2.clickCard(this.randyll);

            this.player2.clickPrompt('Done');

            expect(this.randyll.getStrength()).toBe(0);

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            expect(this.randyll.kneeled).toBe(true);
            expect(this.randyll.getStrength()).toBe(1);
            this.player1.triggerAbility(this.randyll);
            expect(this.randyll.kneeled).toBe(false);
        });

        it('should not count as raising strength for the purposes of eg standing Randyll when it wears off, even if strangler strength < strength with modifiers < strength set by other source', function () {
            this.completeSetup();
            this.player2.selectPlot(this.palace);
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.strangler);
            this.player1.clickCard(this.randyll);
            this.player1.clickCard(this.forlorn);
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.crown);
            this.player2.clickCard(this.randyll);

            this.player2.clickPrompt('Done');

            expect(this.randyll.getStrength()).toBe(3);

            this.unopposedChallenge(this.player1, 'Power', this.randyll);
            this.player1.clickPrompt('Apply Claim');
            expect(this.player1).not.toAllowAbilityTrigger(this.randyll);
        });

        it('should unapply the set strength effect if removed in challenge, eg by shadow of the east', function () {
            this.completeSetup();
            this.player2.selectPlot(this.p2Pentoshi);
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.strangler);
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');

            this.player2.clickPrompt('Done');

            expect(this.randyll.getStrength()).toBe(5);

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            expect(this.randyll.kneeled).toBe(true);
            expect(this.randyll.getStrength()).toBe(1);
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.east);
            this.player2.clickCard(this.strangler);
            expect(this.randyll.getStrength()).toBe(5);
        });

        it('should unapply the set strength effect if removed in challenge, eg by shadow of the east and revert appropriately if there is another set strength effect', function () {
            this.completeSetup();
            this.player2.selectPlot(this.palace);
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.strangler);
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');

            this.player2.clickPrompt('Done');

            expect(this.randyll.getStrength()).toBe(3);

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.randyll);
            this.player1.clickPrompt('Done');
            expect(this.randyll.kneeled).toBe(true);
            expect(this.randyll.getStrength()).toBe(1);
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.east);
            this.player2.clickCard(this.strangler);
            expect(this.randyll.getStrength()).toBe(3);
        });
    });
});
