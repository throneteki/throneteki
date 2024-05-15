describe('Lady-in-Waiting', function () {
    integration(function () {
        beforeEach(function () {
            const deck1 = this.buildDeck('tyrell', [
                'A Noble Cause',
                'Lady-in-Waiting',
                'Margaery Tyrell (Core)'
            ]);
            const deck2 = this.buildDeck('lannister', [
                'A Noble Cause',
                'Cersei Lannister (Core)',
                'Treachery'
            ]);
            this.player1.selectDeck(deck1);
            this.player2.selectDeck(deck2);
            this.startGame();
            this.keepStartingHands();

            this.player2.clickCard('Cersei Lannister', 'hand');

            this.completeSetup();
            this.selectFirstPlayer(this.player1);

            this.ladyInWaiting = this.player1.findCardByName('Lady-in-Waiting');
            this.margaery = this.player1.findCardByName('Margaery Tyrell');
        });

        describe('when there is no Lady character out', function () {
            beforeEach(function () {
                this.player1.clickCard('Lady-in-Waiting', 'hand');
            });

            it('should marshal as normal', function () {
                expect(this.ladyInWaiting.location).toBe('play area');
            });

            it('should cost the normal amount of gold', function () {
                // 5 gold from plot - 2 for LiW.
                expect(this.player1Object.gold).toBe(3);
            });
        });

        describe('when there is Lady character out', function () {
            beforeEach(function () {
                this.player1.clickCard('Margaery Tyrell', 'hand');
                this.player1.clickCard('Lady-in-Waiting', 'hand');
            });

            it('should not put Lady in Waiting into play immediately', function () {
                expect(this.ladyInWaiting.location).toBe('hand');
            });

            it('should prompt whether to marshal as a dupe', function () {
                expect(this.player1).toHavePrompt('Play Lady-in-Waiting:');
            });

            describe('and the player chooses to marshal as a dupe', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Marshal as dupe');
                    this.player1.clickCard('Margaery Tyrell', 'play area');
                });

                it('should add it as a dupe', function () {
                    expect(this.ladyInWaiting.location).toBe('duplicate');
                    expect(this.margaery.dupes.length).toBe(1);
                    expect(this.margaery.dupes).toContain(this.ladyInWaiting);
                });

                it('should not cost any gold', function () {
                    // 5 gold from plot - 1 from Margaery - 0 for LiW.
                    expect(this.player1Object.gold).toBe(4);
                });
            });
        });

        describe('when marshalling as a dupe', function () {
            beforeEach(function () {
                // Give Player 2 some gold for Treachery
                this.player2Object.gold = 3;

                this.player1.clickCard('Margaery Tyrell', 'hand');
                this.player1.clickCard('Lady-in-Waiting', 'hand');
                this.player1.clickPrompt('Marshal as dupe');
                this.player1.clickCard('Margaery Tyrell', 'play area');
            });

            it('should not allow it to be canceled', function () {
                expect(this.player2).not.toAllowAbilityTrigger('Treachery');
            });
        });
    });
});
