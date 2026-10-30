describe('To the Rose Banner!', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Arrogant Contender'], hand: ['To the Rose Banner! (WotN)'] }
        });
        this.startingGold = this.player1Object.gold;
        this.player1.clickCard(this.toTheRoseBanner);
        this.player1.clickCard(this.arrogantContender);
    });

    it("gains gold equal to a tyrell character's STR, then sacrifices it", function () {
        expect(this.player1Object.gold).toBe(
            this.startingGold + this.arrogantContender.getPrintedStrength()
        );
        expect(this.arrogantContender.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
