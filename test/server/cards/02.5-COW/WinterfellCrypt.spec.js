describe('Winterfell Crypt', function() {
    integration(function() {
        beforeEach(function() {
            const deck1 = this.buildDeck('stark', [
                'A Noble Cause',
                'Winterfell Crypt', 'Arya Stark (Core)', 'Bran Stark (Core)', 'Bran Stark (Core)'
            ]);

            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck1);
            this.startGame();
            this.keepStartingHands();

            this.crypt = this.player1.findCardByName('Winterfell Crypt', 'hand');
            this.arya = this.player1.findCardByName('Arya Stark', 'hand');
            [this.bran, this.bran2] = this.player2.filterCardsByName('Bran Stark', 'hand');
            this.player1.clickCard(this.crypt);
            this.player1.clickCard(this.arya);
            this.player2.clickCard(this.bran);

            this.completeSetup();

            this.selectFirstPlayer(this.player1);

            this.completeMarshalPhase();
        });

        describe('when winterfell crypt is triggered', function() {
            beforeEach(function() {
                this.player1Object.killCharacter(this.arya);
                this.player1.clickCard(this.crypt);
            });

            it('should ask the player to choose a target and return it at the end of the phase', function() {
                expect(this.player1).toHavePrompt('Any reactions to Arya Stark being killed?');
                this.player1.clickCard(this.crypt);
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.bran);
                this.completeChallengesPhase();
                expect(this.bran.location).toBe('draw deck');
            });

            it('should use a dupe against the return to deck', function() {
                this.player2.dragCard(this.bran2, 'play area');
                expect(this.player1).toHavePrompt('Any reactions to Arya Stark being killed?');
                this.player1.clickCard(this.crypt);
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.bran);
                expect(this.bran.dupes.length).toBe(1);
                this.completeChallengesPhase();
                expect(this.bran.location).toBe('play area');
                expect(this.bran2.location).toBe('discard pile');
                expect(this.bran.dupes.length).toBe(0);
            });

            it('should allow a manually used dupe to save against the return to deck', function() {
                this.player2.toggleManualDupes(true);
                this.player2.dragCard(this.bran2, 'play area');
                expect(this.player1).toHavePrompt('Any reactions to Arya Stark being killed?');
                this.player1.clickCard(this.crypt);
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.bran);
                expect(this.bran.dupes.length).toBe(1);
                this.completeChallengesPhase();
                expect(this.player2).toAllowAbilityTrigger(this.bran2);
                this.player2.clickCard(this.bran2);
                expect(this.bran.location).toBe('play area');
                expect(this.bran2.location).toBe('discard pile');
                expect(this.bran.dupes.length).toBe(0);
            });

            it('should prompt for manually saving with a dupe', function() {
                this.player2.toggleManualDupes(true);
                this.player2.dragCard(this.bran2, 'play area');
                expect(this.player1).toHavePrompt('Any reactions to Arya Stark being killed?');
                this.player1.clickCard(this.crypt);
                expect(this.player1).toHavePrompt('Select a character');
                this.player1.clickCard(this.bran);
                expect(this.bran.dupes.length).toBe(1);
                this.completeChallengesPhase();
                expect(this.player2).toAllowAbilityTrigger(this.bran2);
                this.player2.clickPrompt('Pass');
                expect(this.bran.location).toBe('draw deck');
                expect(this.bran2.location).toBe('discard pile');
            });
        });
    });
});
