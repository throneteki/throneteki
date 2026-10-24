describe('Dragon Gate', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Dragon Gate'] } });
    });

    it('raises your income by 1', function () {
        expect(this.player1Object.gold).toBe(6);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Dragon Gate', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Dragon Gate',
                    { card: 'Eddard Stark (Core)', attachments: ['Seal of the Hand', 'Bodyguard'] }
                ]
            }
        });
        this.player1.clickCard(this.dragonGate);
    });

    it('sacrifices itself to draw 2 cards while you control 2 or more attachments', function () {
        expect(this.dragonGate.location).toBe('discard pile');
        expect(this.player1Object.hand).toHaveLength(2);
        expect(this.player1).isReadyToTakeAction();
    });
});
