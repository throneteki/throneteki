describe('Filthy Accusations', function () {
    describe('when there are standing characters', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plot: 'Filthy Accusations',
                    inPlay: [
                        'Tumblestone Knight',
                        { card: 'Bastard in Hiding', kneeling: true },
                        'The Kingsroad'
                    ]
                },
                player2: {
                    inPlay: [
                        'House Dayne Knight',
                        { card: 'Courtesan of the Rose', kneeling: true }
                    ]
                }
            });

            this.player1.selectPlot('Filthy Accusations');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
        });

        it('allows a standing character to be chosen', function () {
            expect(this.player1).toHavePrompt('Select a character');
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).toBeAbleToSelect(this.houseDayneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
            expect(this.player1).not.toBeAbleToSelect(this.courtesanOfTheRose);
            expect(this.player1).not.toBeAbleToSelect(this.theKingsroad);
        });

        it("kneels the chosen opponent's character", function () {
            this.player1.clickCard(this.houseDayneKnight);

            expect(this.houseDayneKnight.kneeled).toBe(true);
            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.bastardInHiding.kneeled).toBe(true);
            expect(this.courtesanOfTheRose.kneeled).toBe(true);
            expect(this.theKingsroad.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });

        it('kneels the chosen character you control', function () {
            this.player1.clickCard(this.tumblestoneKnight);

            expect(this.tumblestoneKnight.kneeled).toBe(true);
            expect(this.houseDayneKnight.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when every character is kneeling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    plot: 'Filthy Accusations',
                    inPlay: [{ card: 'Tumblestone Knight', kneeling: true }]
                },
                player2: {
                    inPlay: [{ card: 'House Dayne Knight', kneeling: true }]
                }
            });

            this.player1.selectPlot('Filthy Accusations');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
        });

        it('resolves without a prompt', function () {
            expect(this.tumblestoneKnight.kneeled).toBe(true);
            expect(this.houseDayneKnight.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
