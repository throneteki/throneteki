describe('No Use For Grief', function () {
    describe('after a martell character was killed under your control this round', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    inPlay: ['House Dayne Knight'],
                    hand: ['No Use For Grief'],
                    deck: ['Bastard Daughter']
                },
                player2: { inPlay: ['Castle Guard'] }
            });
            this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
            this.player1.clickCard(this.houseDayneKnight);
            this.bastardDaughter = this.player1.findCardByName('Bastard Daughter', 'draw deck');
            this.player1.clickCard(this.noUseForGrief);
        });

        it('searches your deck for a Sand Snake with printed cost 3 or lower and puts it into play', function () {
            this.player1.clickCard(this.bastardDaughter);
            expect(this.bastardDaughter.location).toBe('play area');
        });
    });
});
