describe('Winter Is Coming', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'stark',
                gold: 2,
                hand: ['Winter Is Coming', 'Winter Is Coming'],
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Bastard in Hiding', 'House Maester']
            }
        });

        [this.first, this.second] = this.player1.filterCardsByName('Winter Is Coming', 'hand');
    });

    it('cannot be played outside a challenge', function () {
        expect(this.player1.actionUnavailableReason(this.first)).toBe('condition');
    });

    describe('during a challenge', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.first);
        });

        it('raises the claim on your revealed plot by 1 until the end of the challenge', function () {
            expect(this.player1Object.getClaim()).toBe(2);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 plays Winter Is Coming to raise the claim value on their revealed plot card by 1 until the end of the challenge'
            );

            this.player2.clickPrompt('Pass');
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player2).toHavePrompt('Select 2 characters to fulfill military claim');
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickCard(this.houseMaester);
            this.player2.clickPrompt('Done');
            this.player2.clickPrompt('Done');

            expect(this.bastardInHiding.location).toBe('dead pile');
            expect(this.houseMaester.location).toBe('dead pile');
            expect(this.player1Object.getClaim()).toBe(1);
        });

        it('can only be played once per challenge', function () {
            this.player2.clickPrompt('Pass');

            expect(this.player1.actionUnavailableReason(this.second)).toBe('limit');
        });
    });
});
