import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Oldtown Informer (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Oldtown Informer (R)', tokens: { [Tokens.gold]: 2 } },
                    'Hedge Knight'
                ],
                hand: ['Burned Men'],
                drawDeck: ['Castle Guard', 'Winterfell Steward'],
                gold: 2
            }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.burnedMen);
        this.player1.triggerAbility('Oldtown Informer');
        this.player1.clickCard(this.castleGuard);
        this.player1.clickCard(this.winterfellSteward);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
    });

    it('draws X cards, then discards X cards, where X is its gold', function () {
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.winterfellSteward.location).toBe('discard pile');
    });
});
