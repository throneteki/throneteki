describe('Master of Coin', function () {
    beforeEach(function () {
        this.setupTest({ gameFormat: 'melee', phase: 'plot' });
        for (const player of [this.player1, this.player2, this.player3]) {
            player.selectPlot('Filler Plot');
        }
        this.selectFirstPlayer(this.player1);
        this.player1.selectTitle('Master of Coin');
        this.player2.selectTitle('Master of Laws');
        this.player3.selectTitle('Master of Ships');
    });

    it('adds two income to its controller without changing other players income', function () {
        expect(this.player1Object.gold).toBe(7);
        expect(this.player1Object.getIncome()).toBe(7);
        expect(this.player2Object.getIncome()).toBe(5);
        expect(this.player3Object.getIncome()).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    it('supports Master of Ships and rivals Hand of the King and Master of Whispers', function () {
        const title = this.player1Object.title;
        const titles = this.game.titlePool.cards;
        expect(title.isSupporter(this.player3Object.title)).toBe(true);
        expect(title.isSupporter(this.player2Object.title)).toBe(false);
        expect(title.isRival(titles.find((card) => card.name === 'Hand of the King'))).toBe(true);
        expect(title.isRival(titles.find((card) => card.name === 'Master of Whispers'))).toBe(true);
        expect(title.isRival(this.player2Object.title)).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
