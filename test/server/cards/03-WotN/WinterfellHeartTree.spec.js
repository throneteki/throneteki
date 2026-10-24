describe('Winterfell Heart Tree', function () {
    describe('after a phase begins', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Tumblestone Knight'], hand: ['Winterfell Heart Tree'] }
            });
            this.player1.clickCard(this.winterfellHeartTree);
            this.completeMarshalPhase();
            this.player1.triggerAbility(this.winterfellHeartTree);
            this.player1.clickCard(this.tumblestoneKnight);
        });

        it("is sacrificed to give a stark card you control immunity to opponents' plot effects", function () {
            expect(this.winterfellHeartTree.location).toBe('discard pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
