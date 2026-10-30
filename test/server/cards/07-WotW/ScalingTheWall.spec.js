describe('Scaling the Wall', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Wildling Horde', 'Tumblestone Knight'],
                hand: ['Scaling the Wall'],
                gold: 1
            },
            player2: { inPlay: ['The Kingsroad', 'Sunspear (BtB)'] }
        });
    });

    describe('after you win a challenge with an attacking Wildling', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Military', this.wildlingHorde);
            this.player1.triggerAbility(this.scalingTheWall);
        });

        it("returns a non-limited location controlled by the losing opponent to its owner's hand", function () {
            expect(this.player1).toBeAbleToSelect(this.sunspear);
            expect(this.player1).not.toBeAbleToSelect(this.theKingsroad);

            this.player1.clickCard(this.sunspear);

            expect(this.sunspear.location).toBe('hand');
            expect(this.theKingsroad.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('after you win a challenge without an attacking Wildling', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        });

        it('is not offered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.scalingTheWall);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
