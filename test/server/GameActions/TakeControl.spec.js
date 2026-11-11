describe('taking control of a card', function () {
    beforeEach(function () {
        this.setupTest({
            firstPlayer: 'player2',
            player1: { faction: 'lannister', inPlay: ['Bronn (CoW)'] },
            player2: { faction: 'lannister' }
        });

        this.interrupted = [];
        this.game.on('onCardTakenControl:interrupt', (event) =>
            this.interrupted.push({ controller: event.card.controller, event })
        );

        this.player2.clickMenu(this.bronn, 'Take control of Bronn');
    });

    it('changes control through an event that interrupts can see before it happens', function () {
        expect(this.interrupted).toHaveLength(1);
        expect(this.interrupted[0].controller).toBe(this.player1.player);
        expect(this.interrupted[0].event.oldController).toBe(this.player1.player);
        expect(this.interrupted[0].event.player).toBe(this.player2.player);
        expect(this.interrupted[0].event.source).toBe(this.bronn);
        expect(this.bronn).toBeControlledBy(this.player2);
        expect(this.player2).isReadyToTakeAction();
    });
});
