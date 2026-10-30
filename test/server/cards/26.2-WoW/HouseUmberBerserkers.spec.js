describe('House Umber Berserkers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'stark',
                plotDeck: ['Filler Plot', 'Filler Plot', 'Filler Plot'],
                shadows: ['House Umber Berserkers'],
                hand: ['Little Bird (Core)'],
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                plotDeck: ['Filler Plot', 'Filler Plot', 'Filler Plot']
            }
        });

        this.nextRound = function () {
            this.completeRound();
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        };
    });

    it('has assault', function () {
        expect(this.houseUmberBerserkers.hasKeyword('Assault')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('costs 1 to bring out of shadows with no plots in the used pile', function () {
        expect(this.player1Object.plotDiscard).toHaveLength(0);

        this.player1.clickCard(this.houseUmberBerserkers);

        expect(this.houseUmberBerserkers.location).toBe('play area');
        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });

    it('costs 1 to bring out of shadows with 1 plot in the used pile', function () {
        this.nextRound();
        expect(this.player1Object.plotDiscard).toHaveLength(1);

        this.player1.clickCard(this.houseUmberBerserkers);

        expect(this.player1Object.gold).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });

    it('costs X to bring out of shadows, where X is the number of plots in the used pile', function () {
        this.nextRound();
        this.nextRound();
        expect(this.player1Object.plotDiscard).toHaveLength(2);

        this.player1.clickCard(this.houseUmberBerserkers);

        expect(this.player1Object.gold).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot have attachments', function () {
        this.player1.clickCard(this.houseUmberBerserkers);
        this.player1.clickCard(this.littleBird);

        expect(this.player1).not.toBeAbleToSelect(this.houseUmberBerserkers);
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player1).isReadyToTakeAction();
    });
});
