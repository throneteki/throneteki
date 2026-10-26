describe('No Crown but Truth', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Maester Luwin'],
                hand: ['No Crown but Truth'],
                drawDeck: ['Hedge Knight']
            },
            player2: { inPlay: ['Lannisport Merchant'] }
        });
        this.player2.clickCard(this.lannisportMerchant);
        this.player1.triggerAbility('No Crown but Truth');
        this.player1.clickCard(this.maesterLuwin);
    });

    it("kills a Maester to cancel an opponent's triggered character ability and draw 1 card", function () {
        expect(this.maesterLuwin.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});

describe("No Crown but Truth when an opponent uses your character's ability", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Maester Luwin', 'Bronn (CoW)'],
                hand: ['No Crown but Truth'],
                drawDeck: ['Hedge Knight']
            },
            player2: { gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.bronn);
    });

    it('kills a Maester to cancel it and draw 1 card', function () {
        expect(this.player1).toAllowAbilityTrigger(this.noCrownButTruth);

        this.player1.triggerAbility(this.noCrownButTruth);
        this.player1.clickCard(this.maesterLuwin);

        expect(this.maesterLuwin.location).toBe('dead pile');
        expect(this.hedgeKnight.location).toBe('hand');
        expect(this.bronn.controller).toBe(this.player1Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
