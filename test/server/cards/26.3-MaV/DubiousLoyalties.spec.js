describe('Dubious Loyalties', function () {
    describe('after an opponent wins a challenge by 5 or more STR', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { inPlay: [{ card: 'Hedge Knight', attachments: ['Dubious Loyalties'] }] },
                player2: { inPlay: ['Ranging Party'] }
            });
            expect(this.hedgeKnight.hasKeyword('Stealth')).toBe(true);
            expect(this.hedgeKnight.hasKeyword('Renown')).toBe(true);
            expect(this.hedgeKnight.hasTrait('House Bolton')).toBe(true);
            this.unopposedChallenge(this.player2, 'Power', this.rangingParty);
            this.player2.triggerAbility(this.dubiousLoyalties);
        });

        it('lets them discard the top card of their deck to take control of the attached character', function () {
            expect(this.hedgeKnight).toBeControlledBy(this.player2);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
