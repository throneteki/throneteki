describe('Gendry (NMG)', function () {
    it('gains 1 power after you win dominance', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Gendry (NMG)'] }
        });
        this.completeChallengesPhase();
        this.player1.triggerAbility('Gendry');
        expect(this.gendry.power).toBe(1);
    });

    describe('after an opponent wins dominance', function () {
        function setup(test, power) {
            test.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [{ card: 'Gendry (NMG)', kneeling: true, power }, 'Bastard Daughter']
                },
                player2: { inPlay: ['Robb Stark (Core)'] }
            });
            test.completeChallengesPhase();
        }

        it('may discard 1 power from itself', function () {
            setup(this, 1);
            this.player1.clickPrompt('Yes');
            expect(this.gendry.power).toBe(0);
            expect(this.bastardDaughter.location).toBe('play area');
        });

        it('sacrifices a Bastard character if you do not', function () {
            setup(this, 1);
            this.player1.clickPrompt('No');
            this.player1.clickCard(this.bastardDaughter);
            expect(this.gendry.power).toBe(1);
            expect(this.bastardDaughter.location).toBe('discard pile');
        });

        it('sacrifices a Bastard character if it has no power', function () {
            setup(this, 0);
            this.player1.clickCard(this.bastardDaughter);
            expect(this.bastardDaughter.location).toBe('discard pile');
        });
    });
});
