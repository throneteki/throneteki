describe('Reek (HMW)', function () {
    describe('when you marshal Theon Greyjoy', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'greyjoy',
                    gold: 4,
                    hand: ['Theon Greyjoy (Core)'],
                    inPlay: ['Reek (HMW)']
                }
            });

            this.player1.clickCard(this.theonGreyjoy);
        });

        it('sacrifices Reek', function () {
            expect(this.reek.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Reek as they control Theon Greyjoy'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you win an unopposed challenge with an attacking House Bolton character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Reek (HMW)']
                },
                player2: {
                    inPlay: ['Grand Maester Pycelle (Core)', 'House Maester']
                }
            });

            this.unopposedChallenge(this.player1, 'Intrigue', this.reek);
        });

        it('gives control of Reek to the loser, then takes control of a non-loyal character they control', function () {
            this.player1.triggerAbility(this.reek);

            expect(this.player1).toBeAbleToSelect(this.houseMaester);
            expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);

            this.player1.clickCard(this.houseMaester);

            expect(this.reek).toBeControlledBy(this.player2);
            expect(this.houseMaester).toBeControlledBy(this.player1);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Reek to give control of Reek to player2'
            );
            expect(this.game.getPlainTextLog()).toContain(
                'Then, player1 takes control of House Maester'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when the challenge was opposed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Reek (HMW)', 'Grand Maester Pycelle (Core)']
                },
                player2: {
                    inPlay: ['House Maester']
                }
            });

            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.reek);
            this.player1.clickCard(this.grandMaesterPycelle);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.houseMaester);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('cannot be triggered', function () {
            expect(this.game.getPlainTextLog()).toContain(
                'player1 won a intrigue challenge 3 vs 2'
            );
            expect(this.reek).toBeControlledBy(this.player1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
