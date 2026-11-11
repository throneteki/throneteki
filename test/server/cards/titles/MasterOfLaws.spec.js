describe('Master of Laws', function () {
    beforeEach(function () {
        this.setupTest({ gameFormat: 'melee', phase: 'plot' });
        for (const player of [this.player1, this.player2, this.player3]) {
            player.selectPlot('Filler Plot');
        }
        this.selectFirstPlayer(this.player1);
        this.player1.selectTitle('Master of Laws');
        this.player2.selectTitle('Master of Coin');
        this.player3.selectTitle('Master of Ships');
    });

    it('draws one extra card during draw and grants one reserve to its controller', function () {
        expect(this.player1Object.hand).toHaveLength(3);
        expect(this.player2Object.hand).toHaveLength(2);
        expect(this.player3Object.hand).toHaveLength(2);
        expect(this.player1Object.getReserve()).toBe(7);
        expect(this.player2Object.getReserve()).toBe(6);
        expect(this.player3Object.getReserve()).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });

    it('supports Master of Coin and rivals Master of Ships and Master of Whispers', function () {
        const title = this.player1Object.title;
        expect(title.isSupporter(this.player2Object.title)).toBe(true);
        expect(title.isSupporter(this.player3Object.title)).toBe(false);
        expect(title.isRival(this.player3Object.title)).toBe(true);
        expect(
            title.isRival(
                this.game.titlePool.cards.find((card) => card.name === 'Master of Whispers')
            )
        ).toBe(true);
        expect(title.isRival(this.player2Object.title)).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
