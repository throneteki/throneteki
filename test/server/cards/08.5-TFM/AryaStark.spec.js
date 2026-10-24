describe('Arya Stark (TFM)', function () {
    function setup(context, aryaKneeling) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                inPlay: [{ card: 'Arya Stark (TFM)', kneeling: aryaKneeling }, 'Tumblestone Knight']
            },
            player2: {
                inPlay: [{ card: 'Grand Maester Pycelle (Core)', dupes: 1 }]
            }
        });

        context.dupe = context.grandMaesterPycelle.dupes[0];
        context.unopposedChallenge(context.player1, 'Military', context.tumblestoneKnight);
    }

    describe('while Arya Stark is standing', function () {
        beforeEach(function () {
            setup(this, false);
        });

        it('stops characters on either side being saved', function () {
            expect(this.tumblestoneKnight.canBeSaved()).toBe(false);
            expect(this.grandMaesterPycelle.canBeSaved()).toBe(false);

            this.player2.clickCard(this.grandMaesterPycelle);

            expect(this.grandMaesterPycelle.location).toBe('dead pile');
            expect(this.dupe.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while Arya Stark is kneeling', function () {
        beforeEach(function () {
            setup(this, true);
        });

        it('lets characters be saved', function () {
            expect(this.tumblestoneKnight.canBeSaved()).toBe(true);
            expect(this.grandMaesterPycelle.canBeSaved()).toBe(true);

            this.player2.clickCard(this.grandMaesterPycelle);

            expect(this.grandMaesterPycelle.location).toBe('play area');
            expect(this.dupe.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
