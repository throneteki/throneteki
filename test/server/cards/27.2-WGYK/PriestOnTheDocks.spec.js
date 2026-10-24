describe('Priest on the Docks', function () {
    function setup(context, { player1Gold, player2Gold }) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                gold: player1Gold,
                inPlay: ['Priest on the Docks']
            },
            player2: {
                gold: player2Gold,
                inPlay: [
                    'Grey Cliffs',
                    'The Riverroad',
                    'Horn Hill (WGYK)',
                    { card: 'Bastard in Hiding', attachments: ['Little Bird (Core)'] }
                ]
            }
        });

        context.completeChallengesPhase();
    }

    describe('when you win dominance', function () {
        beforeEach(function () {
            setup(this, { player1Gold: 5, player2Gold: 0 });
        });

        it('can be triggered', function () {
            expect(this.player1).toAllowAbilityTrigger(this.priestOnTheDocks);
            this.player1.clickPrompt('Pass');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });

        describe('and it is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.priestOnTheDocks);
            });

            it('can only choose a non-limited location or attachment with printed cost 3 or lower', function () {
                expect(this.player1).toBeAbleToSelect(this.greyCliffs);
                expect(this.player1).toBeAbleToSelect(this.littleBird);
                expect(this.player1).not.toBeAbleToSelect(this.theRiverroad);
                expect(this.player1).not.toBeAbleToSelect(this.hornHill);
                expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
                expect(this.player1).not.toBeAbleToSelect(this.priestOnTheDocks);
                this.player1.clickCard(this.greyCliffs);
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).isReadyToTakeAction();
            });

            it('kills Priest on the Docks to discard the card', function () {
                this.player1.clickCard(this.greyCliffs);

                expect(this.priestOnTheDocks.location).toBe('dead pile');
                expect(this.greyCliffs.location).toBe('discard pile');
                expect(this.littleBird.location).toBe('play area');
                expect(this.theRiverroad.location).toBe('play area');
                expect(this.hornHill.location).toBe('play area');
                expect(this.player1).toHavePrompt('Select a plot');
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).isReadyToTakeAction();
            });

            it('can discard an attachment', function () {
                this.player1.clickCard(this.littleBird);

                expect(this.littleBird.location).toBe('discard pile');
                expect(this.bastardInHiding.location).toBe('play area');
                expect(this.player1).toHavePrompt('Select a plot');
                expect(this.player1).isReadyToTakeAction();
                expect(this.player2).isReadyToTakeAction();
            });
        });
    });

    describe('when an opponent wins dominance', function () {
        beforeEach(function () {
            setup(this, { player1Gold: 0, player2Gold: 5 });
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.priestOnTheDocks);
            expect(this.player1).toHavePrompt('Select a plot');
            expect(this.player1).isReadyToTakeAction();
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
