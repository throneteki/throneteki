describe('Dacey Mormont', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Bran Stark (Core)'],
                inPlay: ['Dacey Mormont', 'Tumblestone Knight', 'Hedge Knight']
            },
            player2: {
                inPlay: ['Bear Island Scout (R)']
            }
        });
    });

    it('has STR equal to the number of [stark] characters you control', function () {
        expect(this.daceyMormont.getStrength()).toBe(2);
        expect(this.bearIslandScout.getStrength()).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('updates when another [stark] character enters play', function () {
        this.player1.clickCard(this.branStark);

        expect(this.daceyMormont.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
