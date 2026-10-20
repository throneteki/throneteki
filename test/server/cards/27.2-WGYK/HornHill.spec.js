describe('Horn Hill', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'tyrell',
                plot: 'A Noble Cause',
                inPlay: ['Horn Hill (WGYK)', 'House Dayne Knight', 'Tumblestone Knight']
            },
            player2: {
                faction: 'martell',
                plot: 'A Song of Summer',
                inPlay: ['Bastard in Hiding']
            }
        });
    });

    it('gives its controller +1 initiative', function () {
        expect(this.player1Object.getInitiative()).toBe(1);
        expect(this.player2Object.getInitiative()).toBe(
            this.aSongOfSummer.cardData.plotStats.initiative
        );
    });

    it('does not raise claim outside a challenge', function () {
        expect(this.player1Object.getClaim()).toBe(1);
    });

    describe('during the first challenge its controller initiates', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.houseDayneKnight);
            this.player1.clickPrompt('Done');
        });

        it('raises the claim on their plot by 1', function () {
            expect(this.player1Object.getClaim()).toBe(2);
            expect(this.player2Object.getClaim()).toBe(1);
        });

        it('stops raising it once the challenge ends', function () {
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player1Object.getClaim()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('then in their second challenge', function () {
            beforeEach(function () {
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();

                this.player1.clickPrompt('Military');
                this.player1.clickCard(this.tumblestoneKnight);
                this.player1.clickPrompt('Done');
            });

            it('does not raise the claim', function () {
                expect(this.player1Object.getClaim()).toBe(1);
            });
        });
    });

    describe('during a challenge its controller does not initiate', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
        });

        it('does not raise the claim on either plot', function () {
            expect(this.player1Object.getClaim()).toBe(1);
            expect(this.player2Object.getClaim()).toBe(1);
        });
    });
});
