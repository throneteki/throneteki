describe('Ours is the Old Way', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lordsport Shipwright'], hand: ['Ours is the Old Way'], gold: 4 },
            player2: { inPlay: ['Ser Davos Seaworth (Core)'] }
        });
        this.player1.clickCard(this.oursIsTheOldWay);
        this.player1.clickPrompt('Gain stealth');
    });

    it('gives each greyjoy character you control stealth until the end of the phase', function () {
        expect(this.lordsportShipwright.hasKeyword('stealth')).toBe(true);
        expect(this.serDavosSeaworth.hasKeyword('stealth')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Ours is the Old Way', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lordsport Shipwright'], hand: ['Ours is the Old Way'], gold: 4 },
            player2: { inPlay: ['Ser Davos Seaworth (Core)'] }
        });
        this.player1.clickCard(this.oursIsTheOldWay);
        this.player1.clickPrompt('Lose stealth');
    });

    it('makes each non-greyjoy character lose stealth until the end of the phase', function () {
        expect(this.serDavosSeaworth.hasKeyword('stealth')).toBe(false);
        expect(this.lordsportShipwright.hasKeyword('stealth')).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
