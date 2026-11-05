describe('Dragon Skull', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    hand: ['Dragon Skull'],
                    inPlay: ['Targaryen Loyalist', 'Tumblestone Knight']
                }
            });

            this.player1.clickCard(this.dragonSkull);
            this.player1.clickPrompt('Marshal');
        });

        it('can only be attached to a [targaryen] character, which gains intimidate and renown while there are no Dragons in play', function () {
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player1.clickCard(this.targaryenLoyalist);

            expect(this.targaryenLoyalist.hasKeyword('Intimidate')).toBe(true);
            expect(this.targaryenLoyalist.hasKeyword('Renown')).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
