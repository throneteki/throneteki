describe('Gate of the Gods', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Gate of the Gods'] } });
    });

    it('raises your income by 1', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Gate of the Gods', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Gate of the Gods', 'Khal Drogo (Core)'] }
        });
        this.player1.clickCard(this.gateOfTheGods);
    });

    it('sacrifices itself to draw 2 cards while you control the character with the highest STR', function () {
        expect(this.gateOfTheGods.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
