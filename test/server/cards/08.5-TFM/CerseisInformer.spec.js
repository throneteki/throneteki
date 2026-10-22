import { Tokens } from '../../../../server/game/Constants/index.js';

describe("Cersei's Informer", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: [
                    { card: "Cersei's Informer", tokens: { [Tokens.gold]: 1 } },
                    'Hedge Knight'
                ],
                hand: ['Castle Guard'],
                drawDeck: ['Winterfell Steward']
            }
        });
        this.player1.clickMenu(this.cerseisInformer, 'Draw card');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.castleGuard);
    });

    it('moves 1 gold to a non-Spy card you control to draw 1 card, then discards 1 card from hand', function () {
        expect(this.hedgeKnight.tokens[Tokens.gold]).toBe(1);
        expect(this.winterfellSteward.location).toBe('hand');
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
