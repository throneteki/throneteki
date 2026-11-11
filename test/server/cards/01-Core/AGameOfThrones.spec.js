describe('A Game of Thrones', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                plot: 'A Game of Thrones',
                inPlay: ['House Maester', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding']
            }
        });
    });

    it('stops you initiating [military] or [power] challenges before you win an [intrigue] challenge', function () {
        expect(this.player1).toHaveDisabledPromptButton('Military');
        expect(this.player1).toHaveDisabledPromptButton('Power');
        expect(this.player1).not.toHaveDisabledPromptButton('Intrigue');
        expect(this.player1).isReadyToTakeAction();
    });

    describe('after you win an [intrigue] challenge', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Intrigue', this.houseMaester);
        });

        it('lets you initiate [military] and [power] challenges', function () {
            expect(this.player1).not.toHaveDisabledPromptButton('Military');
            expect(this.player1).not.toHaveDisabledPromptButton('Power');
            expect(this.player1).isReadyToTakeAction();
        });

        it('still stops an opponent who has not won an [intrigue] challenge', function () {
            this.player1.clickPrompt('Done');

            expect(this.player2).toHaveDisabledPromptButton('Military');
            expect(this.player2).toHaveDisabledPromptButton('Power');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
