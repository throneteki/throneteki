describe('Ser Jorah Mormont (Core)', function () {
    describe('when you win a challenge in which he is participating', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    inPlay: ['Ser Jorah Mormont (Core)']
                },
                player2: {
                    inPlay: ['House Maester']
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.serJorahMormont);
            this.player2.clickCard(this.houseMaester);
        });

        it('places 1 betrayal token on him', function () {
            expect(this.serJorahMormont.tokens.betrayal).toBe(1);
            expect(this.serJorahMormont.location).toBe('play area');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 is forced to place 1 betrayal token on Ser Jorah Mormont'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when he gets his third betrayal token', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    inPlay: [{ card: 'Ser Jorah Mormont (Core)', tokens: { betrayal: 2 } }]
                },
                player2: {
                    inPlay: ['House Maester']
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.serJorahMormont);
            this.player2.clickCard(this.houseMaester);
        });

        it('sacrifices him', function () {
            expect(this.serJorahMormont.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Ser Jorah Mormont as it has 3 or more betrayal tokens'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you win a challenge he is not participating in', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    inPlay: ['Ser Jorah Mormont (Core)', 'Tumblestone Knight']
                },
                player2: {
                    inPlay: ['House Maester']
                }
            });

            this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
            this.player2.clickCard(this.houseMaester);
        });

        it('places no betrayal token', function () {
            expect(this.serJorahMormont.tokens.betrayal).toBeUndefined();
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
