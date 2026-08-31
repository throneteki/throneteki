describe('Quentyn Martell', function () {
    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('martell', [
                'A Noble Cause',
                'Quentyn Martell (ToJ)',
                'Knighted',
                'Melisandre (Core)',
                'Wildling Horde'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();

            this.quentyn = this.player1.findCardByName('Quentyn Martell', 'hand');
            this.knighted = this.player1.findCardByName('Knighted', 'hand');
            this.melisandre = this.player1.findCardByName('Melisandre', 'hand');
            this.wildlingHorde = this.player1.findCardByName('Wildling Horde', 'hand');

            this.player1.clickCard(this.quentyn);
            this.player1.clickPrompt('Setup');
            this.player1.clickCard(this.knighted);

            this.completeSetup();

            this.player1.clickCard(this.knighted);
            this.player1.clickCard(this.quentyn);

            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
        });

        describe('when triggered with a STR buff', function () {
            beforeEach(function () {
                this.player1.clickMenu(this.quentyn, 'Put a character into play');
            });

            it('should allow you to choose a character with STR 4 or lower', function () {
                expect(this.player1).toAllowSelect(this.melisandre);
                expect(this.player1).not.toAllowSelect(this.wildlingHorde);
            });

            describe('and a character is chosen', function () {
                beforeEach(function () {
                    this.player1.clickCard(this.melisandre);
                });

                it('should put the chosen character into play', function () {
                    expect(this.melisandre.location).toBe('play area');
                });

                it('should put quentyn into shadows', function () {
                    expect(this.quentyn.location).toBe('shadows');
                });

                describe('at the end of the phase', function () {
                    beforeEach(function () {
                        this.completeChallengesPhase();
                    });

                    it("should return target character to the player's hand", function () {
                        expect(this.melisandre.location).toBe('hand');
                    });
                });
            });
        });
    });
});
