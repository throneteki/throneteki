describe('Shadow City Septon', function () {
    function setup(context, { player1Gold, player2Gold }) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                gold: player1Gold,
                inPlay: ['Shadow City Septon', 'Tumblestone Knight']
            },
            player2: {
                gold: player2Gold,
                inPlay: ['Palace Spearman', { card: 'Bastard in Hiding', kneeling: true }]
            }
        });

        context.completeChallengesPhase();
    }

    describe('when you lose dominance', function () {
        beforeEach(function () {
            setup(this, { player1Gold: 0, player2Gold: 5 });
        });

        it('can be triggered', function () {
            expect(this.player1).toAllowAbilityTrigger(this.shadowCitySepton);
            this.player1.clickPrompt('Pass');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });

        describe('and it is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.shadowCitySepton);
            });

            it('returns itself to shadows', function () {
                expect(this.shadowCitySepton.location).toBe('shadows');
                this.player2.clickCard(this.palaceSpearman);
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).isReadyToTakeAction();
            });

            it('has the winning opponent choose a standing character they control', function () {
                expect(this.player2).toBeAbleToSelect(this.palaceSpearman);
                expect(this.player2).not.toBeAbleToSelect(this.bastardInHiding);
                expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);
                expect(this.player1).not.toBeAbleToSelect(this.palaceSpearman);
                this.player2.clickCard(this.palaceSpearman);
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).isReadyToTakeAction();
            });

            it("returns that character to its owner's hand", function () {
                this.player2.clickCard(this.palaceSpearman);

                expect(this.palaceSpearman.location).toBe('hand');
                expect(this.bastardInHiding.location).toBe('play area');
                expect(this.tumblestoneKnight.location).toBe('play area');
                expect(this.player1).toHavePrompt('Select a plot');
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).isReadyToTakeAction();
            });
        });
    });

    describe('when you win dominance', function () {
        beforeEach(function () {
            setup(this, { player1Gold: 10, player2Gold: 0 });
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.shadowCitySepton);
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
