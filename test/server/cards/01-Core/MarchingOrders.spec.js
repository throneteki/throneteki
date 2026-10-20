describe('Marching Orders', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Marching Orders',
                hand: ['Winterfell Steward', 'The Roseroad', 'Little Bird', 'Nightmares'],
                inPlay: ['Tumblestone Knight']
            },
            player2: { hand: ['The Kingsroad'] }
        });
    });

    it('lets you marshal characters', function () {
        this.player1.clickCard(this.winterfellSteward);

        expect(this.winterfellSteward.location).toBe('play area');
    });

    it('stops you marshaling locations or attachments', function () {
        this.player1.clickCard(this.theRoseroad);
        this.player1.clickCard(this.littleBird);

        expect(this.theRoseroad.location).toBe('hand');
        expect(this.littleBird.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('stops you playing events', function () {
        this.player1.clickCard(this.nightmares);

        expect(this.nightmares.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not affect opponents', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.theKingsroad);

        expect(this.theKingsroad.location).toBe('play area');
    });
});
