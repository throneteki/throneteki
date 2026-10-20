describe('Pink Graces', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Pink Graces', 'Hedge Knight'],
                drawDeck: ['Nightmares']
            },
            player2: {
                inPlay: ['Bastard in Hiding'],
                drawDeck: ['Tithe']
            }
        });
    });

    describe('when no player applied military claim', function () {
        beforeEach(function () {
            this.completeChallengesPhase();
            this.player1.triggerAbility(this.pinkGraces);
        });

        it('lets each player draw 1 card', function () {
            expect(this.player1).toHavePrompt('Draw 1 card from Pink Graces?');
            this.player1.clickPrompt('Yes');

            expect(this.player2).toHavePrompt('Draw 1 card from Pink Graces?');
            this.player2.clickPrompt('Yes');

            expect(this.nightmares.location).toBe('hand');
            expect(this.tithe.location).toBe('hand');
            expect(this.player1).toHavePrompt('Select a plot');
        });

        it('can be declined', function () {
            this.player1.clickPrompt('No');
            this.player2.clickPrompt('No');

            expect(this.nightmares.location).toBe('draw deck');
            expect(this.tithe.location).toBe('draw deck');
            expect(this.player1).toHavePrompt('Select a plot');
        });
    });

    describe('when a player applied military claim', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
            this.player2.clickCard(this.bastardInHiding);
            this.completeChallengesPhase();
            this.player1.triggerAbility(this.pinkGraces);
        });

        it('does not let that player draw', function () {
            expect(this.player2).toHavePrompt('Draw 1 card from Pink Graces?');
            this.player2.clickPrompt('Yes');

            expect(this.tithe.location).toBe('hand');
            expect(this.nightmares.location).toBe('draw deck');
            expect(this.player1).toHavePrompt('Select a plot');
        });
    });
});
