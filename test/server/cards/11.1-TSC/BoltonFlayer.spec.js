describe('Bolton Flayer', function () {
    describe('when the challenges phase ends', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Bolton Flayer', 'Tumblestone Knight']
                },
                player2: {
                    inPlay: [
                        { card: 'Samwell Tarly (Core)', dupes: 1 },
                        'Grand Maester Pycelle (Core)'
                    ]
                }
            });

            this.dupe = this.samwellTarly.dupes[0];
            this.completeChallengesPhase();
        });

        it('makes its controller choose a character with the lowest printed cost', function () {
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).toBeAbleToSelect(this.samwellTarly);
            expect(this.player1).not.toBeAbleToSelect(this.boltonFlayer);
            expect(this.player1).not.toBeAbleToSelect(this.grandMaesterPycelle);
            expect(this.player2).not.toBeAbleToSelect(this.samwellTarly);

            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.location).toBe('dead pile');
            expect(this.samwellTarly.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('kills the chosen character, which cannot be saved', function () {
            this.player1.clickCard(this.samwellTarly);

            expect(this.samwellTarly.location).toBe('dead pile');
            expect(this.dupe.location).toBe('discard pile');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.grandMaesterPycelle.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while in shadows', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    shadows: ['Bolton Flayer'],
                    inPlay: ['Tumblestone Knight']
                }
            });

            this.completeChallengesPhase();
        });

        it('does nothing when the challenges phase ends', function () {
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
