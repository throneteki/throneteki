describe('Sand Steed', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'martell',
                    hand: ['Sand Steed'],
                    inPlay: [
                        { card: 'House Dayne Knight', attachments: ['Sand Steed'] },
                        'House Maester'
                    ]
                }
            });

            this.handSteed = this.player1.findCardByName('Sand Steed', 'hand');
            this.player1.clickCard(this.handSteed);
        });

        it('cannot be attached to a character that already has a Sand Steed', function () {
            expect(this.player1).not.toBeAbleToSelect(this.houseDayneKnight);
            expect(this.player1).toBeAbleToSelect(this.houseMaester);

            this.player1.clickCard(this.houseMaester);

            expect(this.houseMaester.attachments).toContain(this.handSteed);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a new plot is revealed', function () {
        function setup(context, plot) {
            context.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'martell',
                    plot,
                    plotDeck: ['A Noble Cause'],
                    inPlay: [{ card: 'House Dayne Knight', attachments: ['Sand Steed'] }]
                },
                player2: { plot: 'A Noble Cause' }
            });

            context.completeChallengesPhase();
            context.player2.selectPlot('A Noble Cause');
            context.selectFirstPlayer(context.player1);
        }

        it('gives the attached character 1 power after a Summer plot enters your used pile', function () {
            setup(this, 'A Song of Summer');

            this.player1.triggerAbility(this.sandSteed);

            expect(this.houseDayneKnight.power).toBe(1);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Sand Steed to gain power on House Dayne Knight'
            );
            expect(this.player1).isReadyToTakeAction();
        });

        it('cannot be triggered after another plot enters your used pile', function () {
            setup(this, 'Sneak Attack');

            expect(this.player1).not.toAllowAbilityTrigger(this.sandSteed);
            expect(this.houseDayneKnight.power).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
