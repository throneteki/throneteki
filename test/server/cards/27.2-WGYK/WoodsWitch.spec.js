describe('Woods Witch', function () {
    function setup(context, player2Hand) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Woods Witch', 'House Dayne Knight']
            },
            player2: {
                faction: 'greyjoy',
                hand: player2Hand,
                inPlay: ['Bastard in Hiding', "Black Wind's Crew", 'Grey Cliffs']
            }
        });

        context.unopposedChallenge(context.player1, 'Intrigue', context.houseDayneKnight);
    }

    describe("when a character is discarded from an opponent's hand", function () {
        beforeEach(function () {
            setup(this, ['Hedge Knight']);
        });

        it('can be triggered', function () {
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).toAllowAbilityTrigger(this.woodsWitch);
        });

        describe('and it is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.woodsWitch);
            });

            it('sacrifices Woods Witch', function () {
                expect(this.woodsWitch.location).toBe('discard pile');
            });

            describe('and a cardtype is named', function () {
                beforeEach(function () {
                    this.player1.clickPrompt('Character');
                });

                it('has that player sacrifice a card of that type with the same printed cost', function () {
                    expect(this.player2).toBeAbleToSelect(this.bastardInHiding);
                    expect(this.player2).not.toBeAbleToSelect(this.blackWindsCrew);
                    expect(this.player2).not.toBeAbleToSelect(this.greyCliffs);
                    expect(this.player2).not.toBeAbleToSelect(this.houseDayneKnight);

                    this.player2.clickCard(this.bastardInHiding);

                    expect(this.bastardInHiding.location).toBe('discard pile');
                    expect(this.blackWindsCrew.location).toBe('play area');
                    expect(this.game.getPlainTextLog()).toContain(
                        'player2 sacrifices Bastard in Hiding'
                    );
                    expect(this.player1).isReadyToTakeAction();
                });
            });

            it('only offers cardtypes they have a card of with that printed cost', function () {
                expect(this.player1).toHavePromptButton('Character');
                expect(this.player1).toHaveDisabledPromptButton('Location');
                expect(this.player1).toHaveDisabledPromptButton('Attachment');
            });
        });
    });

    describe("when an event is discarded from an opponent's hand", function () {
        beforeEach(function () {
            setup(this, ['Nightmares']);
        });

        it('cannot be triggered', function () {
            expect(this.nightmares.location).toBe('discard pile');
            expect(this.player1).not.toAllowAbilityTrigger(this.woodsWitch);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
