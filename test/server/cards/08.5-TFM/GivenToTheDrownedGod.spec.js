describe('Given to the Drowned God', function () {
    describe('when played', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Drowned Disciple (AMAF)'], hand: ['Given to the Drowned God'] }
            });
            this.handBefore = this.player1Object.hand.length;
            this.player1.clickCard(this.givenToTheDrownedGod);
            this.player1.clickCard(this.drownedDisciple);
        });

        it('kills a Drowned God character to draw cards equal to its printed cost', function () {
            expect(this.drownedDisciple.location).toBe('dead pile');
            expect(this.player1Object.hand).toHaveLength(this.handBefore - 1 + 3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
