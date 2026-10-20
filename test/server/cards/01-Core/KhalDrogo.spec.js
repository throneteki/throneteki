describe('Khal Drogo (Core)', function () {
    describe('when you control him', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Khal Drogo (Core)', 'Braided Warrior']
                },
                player2: {
                    inPlay: ['Bastard in Hiding', 'House Dayne Knight']
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.braidedWarrior);
            this.player2.clickCard(this.bastardInHiding);
        });

        it('lets you initiate an additional [military] challenge', function () {
            expect(this.player1).not.toHaveDisabledPromptButton('Military');

            this.unopposedChallenge(this.player1, 'Military', this.khalDrogo);
            this.player2.clickCard(this.houseDayneKnight);

            expect(this.player1).toHaveDisabledPromptButton('Military');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent controls him', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Braided Warrior']
                },
                player2: {
                    inPlay: [{ card: 'Khal Drogo (Core)', kneeling: true }]
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.braidedWarrior);
            this.player2.clickCard(this.khalDrogo);
        });

        it('does not give you an additional [military] challenge', function () {
            expect(this.player1).toHaveDisabledPromptButton('Military');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
