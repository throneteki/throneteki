describe('Tourney Lance', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Tourney Lance'],
                    inPlay: ['Tumblestone Knight', 'House Maester']
                }
            });

            this.player1.clickCard(this.tourneyLance);
        });

        it('can only be attached to a Knight character, which gets +1 STR', function () {
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);

            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while the attached character attacks alone', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Tumblestone Knight', attachments: ['Tourney Lance'] }]
                },
                player2: {
                    inPlay: ['Bastard in Hiding', 'Sansa Stark (WotN)']
                }
            });

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickCard(this.sansaStark);
            this.player2.clickPrompt('Done');
        });

        it('stops the defending player declaring more than 1 defender', function () {
            expect(this.game.currentChallenge.defenders).toEqual([this.bastardInHiding]);

            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
