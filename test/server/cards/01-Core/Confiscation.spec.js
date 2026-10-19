describe('Confiscation', function () {
    describe('when there are attachments in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    faction: 'lannister',
                    plot: 'Confiscation',
                    inPlay: [
                        { card: 'Ser Jaime Lannister (Core)', attachments: ['Little Bird (Core)'] }
                    ]
                },
                player2: {
                    inPlay: [
                        { card: 'Eddard Stark (Core)', attachments: ['Bodyguard'] },
                        'Winterfell Steward'
                    ]
                }
            });

            this.player1.selectPlot('Confiscation');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
        });

        it('allows any attachment in play to be chosen', function () {
            expect(this.player1).toHavePrompt('Select an attachment');
            expect(this.player1).toBeAbleToSelect(this.littleBird);
            expect(this.player1).toBeAbleToSelect(this.bodyguard);
            expect(this.player1).not.toBeAbleToSelect(this.serJaimeLannister);
            expect(this.player1).not.toBeAbleToSelect(this.eddardStark);
            expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);
        });

        it("discards the chosen opponent's attachment", function () {
            this.player1.clickCard(this.bodyguard);

            expect(this.bodyguard.location).toBe('discard pile');
            expect(this.littleBird.location).toBe('play area');
            expect(this.eddardStark.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('discards the chosen attachment you control', function () {
            this.player1.clickCard(this.littleBird);

            expect(this.littleBird.location).toBe('discard pile');
            expect(this.bodyguard.location).toBe('play area');
            expect(this.serJaimeLannister.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when there are no attachments in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    faction: 'lannister',
                    plot: 'Confiscation',
                    inPlay: ['Ser Jaime Lannister (Core)']
                },
                player2: {
                    inPlay: ['Winterfell Steward']
                }
            });

            this.player1.selectPlot('Confiscation');
            this.player2.selectPlot('A Noble Cause');
            this.selectFirstPlayer(this.player1);
        });

        it('resolves without a prompt', function () {
            expect(this.serJaimeLannister.location).toBe('play area');
            expect(this.winterfellSteward.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
