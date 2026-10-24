describe('a gold source granted by a persistent effect', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Casterly Rock (BtB)', { card: 'Lannisport Merchant', gold: 2 }] },
            player2: { inPlay: [{ card: 'Burned Men', gold: 1 }] }
        });
    });

    it("decides who may spend from it using the effect source's controller", function () {
        expect(this.player1Object.getSpendableGold({ activePlayer: this.player1Object })).toBe(
            this.player1Object.gold + 2
        );
        expect(this.player2Object.getSpendableGold({ activePlayer: this.player2Object })).toBe(
            this.player2Object.gold
        );
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('a power as gold source granted without a spending condition', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player2: {
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        power: 2,
                        attachments: [{ card: 'Slander and Lies', owner: 'player1' }]
                    }
                ]
            }
        });
    });

    it('can be spent on anything', function () {
        expect(this.player1Object.getSpendableGold({ activePlayer: this.player1Object })).toBe(
            this.player1Object.gold + 4
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
