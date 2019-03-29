describe('White Sword Tower', function() {
    integration(function() {
        describe('normal cases', function() {
            beforeEach(function() {
                const deck = this.buildDeck('lannister', [
                    'Late Summer Feast',
                    'White Sword Tower', 'Ser Jaime Lannister (LoCR)', 'Nightmares', 'Nightmares'
                ]);
                this.player1.selectDeck(deck);
                this.player2.selectDeck(deck);
                this.startGame();
                this.keepStartingHands();

                this.kingsguard = this.player1.findCardByName('Ser Jaime Lannister', 'hand');
                this.player1.clickCard(this.kingsguard);
                this.player1.clickCard('White Sword Tower', 'hand');

                this.completeSetup();

                this.selectFirstPlayer(this.player1);
            });

            it('gives Kingguard characters +1 STR', function() {
                expect(this.kingsguard.getStrength()).toBe(5);
            });

            describe('when the player controls a Kingsguard character', function() {
                it('allows playing more than one event', function() {
                    this.player1.clickCard('Nightmares', 'hand');
                    this.player1.clickCard(this.kingsguard);
                    this.player1.clickCard('Nightmares', 'hand');
                    expect(this.player1).toHavePrompt('Select a character or location');
                });
            });

            describe('when the player does not control a Kingsguard character', function() {
                beforeEach(function() {
                    this.player1.clickPrompt('Done');

                    this.player2.clickCard('Nightmares', 'hand');
                    this.player2.clickCard(this.kingsguard);
                });

                it('allows playing one event', function() {
                    expect(this.kingsguard.isAnyBlank()).toBe(true);
                });

                it('does not allow playing additional events', function() {
                    this.player2.clickCard('Nightmares', 'hand');
                    expect(this.player2).not.toHavePrompt('Select a character or location');
                });

                describe('if the player gains a Kingsguard character', function() {
                    beforeEach(function() {
                        this.player2.clickCard('Ser Jaime Lannister', 'hand');
                    });

                    it('allows playing additional events', function() {
                        this.player2.clickCard('Nightmares', 'hand');
                        expect(this.player2).toHavePrompt('Select a character or location');
                    });
                });

                describe('when the next phase begins', function() {
                    beforeEach(function() {
                        this.player2.clickPrompt('Done');
                    });

                    it('allows playing additional events', function() {
                        this.player2.clickCard('Nightmares', 'hand');
                        expect(this.player2).toHavePrompt('Select a character or location');
                    });
                });
            });
        });
    });
});
