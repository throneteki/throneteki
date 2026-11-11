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

describe('Arya Stark (TFM) returned to hand with other characters', function () {
    it('stops a duplicate saving a character returned at the same time', function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['The First Snow of Winter'], inPlay: ['Arya Stark (TFM)'] },
            player2: { inPlay: [{ card: 'Bran Stark (Core)', dupes: 1 }] }
        });
        this.player1.selectPlot('The First Snow of Winter');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.completeMarshalPhase();

        expect(this.aryaStark.location).toBe('hand');
        expect(this.branStark.location).toBe('hand');
    });
});
