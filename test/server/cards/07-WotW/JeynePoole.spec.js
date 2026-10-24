describe('Jeyne Poole', function () {
    describe('when used', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Jeyne Poole'], discard: ['Catelyn Stark (Core)'] }
            });
            this.player1.clickMenu(this.jeynePoole, 'Sacrifice Jeyne Poole');
            this.player1.clickCard(this.catelynStark);
        });

        it('is sacrificed to return a Lady character from your discard pile to your hand', function () {
            expect(this.jeynePoole.location).toBe('discard pile');
            expect(this.catelynStark.location).toBe('hand');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
