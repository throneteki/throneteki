describe('Chella Daughter of Cheyk', function () {
    describe('when she gains her 3rd ear token after military claim', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: [{ card: 'Chella Daughter of Cheyk', tokens: { ear: 2 } }] },
                player2: { inPlay: ['Hedge Knight'] }
            });
            this.unopposedChallenge(this.player1, 'Military', this.chellaDaughterOfCheyk);
            this.player2.clickCard(this.hedgeKnight);
            this.player1.triggerAbility(this.chellaDaughterOfCheyk);
        });

        it('places an ear token on her, and immediately gives her renown and intimidate', function () {
            expect(this.chellaDaughterOfCheyk.tokens.ear).toBe(3);
            expect(this.chellaDaughterOfCheyk.getStrength()).toBe(6);
            expect(this.chellaDaughterOfCheyk.power).toBe(1);
            expect(this.chellaDaughterOfCheyk.hasKeyword('renown')).toBe(true);
            expect(this.chellaDaughterOfCheyk.hasKeyword('intimidate')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
