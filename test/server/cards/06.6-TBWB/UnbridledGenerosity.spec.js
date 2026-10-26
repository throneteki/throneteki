describe('Unbridled Generosity', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Tumblestone Knight'], hand: ['Unbridled Generosity'] }
        });
        this.player1.clickCard(this.unbridledGenerosity);
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
    });

    it('moves 1 gold from the treasury to each of up to 3 cards', function () {
        expect(this.tumblestoneKnight.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Unbridled Generosity on cards in play outside the play area', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Unbridled Generosity'] }
        });
        this.player1.clickCard(this.unbridledGenerosity);
    });

    it('can put gold on the revealed plot and the faction card', function () {
        this.player1.clickCard(this.player1Object.activePlot);
        this.player1.clickCard(this.player1Object.faction);
        this.player1.clickPrompt('Done');

        expect(this.player1Object.activePlot.gold).toBe(1);
        expect(this.player1Object.faction.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
