describe('Ser Hobber Redwyne', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Ser Hobber Redwyne'],
                drawDeck: ['Tumblestone Knight', 'Sansa Stark (WotN)']
            }
        });

        this.player1.clickCard(this.serHobberRedwyne);
        this.player1.triggerAbility(this.serHobberRedwyne);
    });

    it('searches your deck for a Lady character after you marshal him', function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.sansaStark);

        expect(this.sansaStark.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
