describe('Dragonstone Proselyte', function () {
    it('cannot be used outside the challenges phase', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'baratheon', inPlay: ['Dragonstone Proselyte'] }
        });

        expect(this.player1.actionUnavailableReason(this.dragonstoneProselyte)).toBe('phase');
        expect(this.player1).isReadyToTakeAction();
    });

    describe('during the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'baratheon',
                    inPlay: ['Dragonstone Proselyte', { card: 'Bastard in Hiding', kneeling: true }]
                },
                player2: {
                    faction: 'greyjoy',
                    inPlay: [{ card: "Black Wind's Crew", kneeling: true }, 'Palace Spearman']
                }
            });

            this.player1.clickMenu(this.dragonstoneProselyte, 'Prevent character from standing');
        });

        it('can only choose a character with STR 3 or lower', function () {
            expect(this.player1).toBeAbleToSelect(this.blackWindsCrew);
            expect(this.player1).toBeAbleToSelect(this.bastardInHiding);
            expect(this.player1).toBeAbleToSelect(this.dragonstoneProselyte);
            expect(this.player1).not.toBeAbleToSelect(this.palaceSpearman);

            this.player1.clickCard(this.blackWindsCrew);

            expect(this.player1).isReadyToTakeAction();
        });

        describe('and a character is chosen', function () {
            beforeEach(function () {
                this.player1.clickCard(this.blackWindsCrew);
            });

            it('kneels Dragonstone Proselyte', function () {
                expect(this.dragonstoneProselyte.kneeled).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });

            it('stops that character standing until the end of the round', function () {
                this.completeChallengesPhase();

                expect(this.blackWindsCrew.kneeled).toBe(true);
                expect(this.bastardInHiding.kneeled).toBe(false);
                expect(this.dragonstoneProselyte.kneeled).toBe(false);
                expect(this.palaceSpearman.kneeled).toBe(false);
                expect(this.player1).toHavePrompt('Select a plot');
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).isReadyToTakeAction();
            });
        });
    });
});
