import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Varys (TTS)', function () {
    it('discards 1 gold to name a card, which cannot be marshaled until the end of the phase', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: [{ card: 'Varys (TTS)', tokens: { [Tokens.gold]: 1 } }] },
            player2: { hand: ['Hedge Knight'] }
        });
        this.player1.clickMenu(this.varys, 'Name a card');
        this.player1.nameCard('Hedge Knight');
        expect(this.varys.tokens[Tokens.gold]).toBeUndefined();
        expect(this.player2Object.canPutIntoPlay(this.hedgeKnight, 'marshal')).toBe(false);
    });

    it('places 1 gold on himself after a Scheme plot is revealed', function () {
        this.setupTest({
            phase: 'plot',
            player1: { inPlay: ['Varys (TTS)'], plotDeck: ['Sneak Attack'] }
        });
        this.player1.selectPlot('Sneak Attack');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.triggerAbility('Varys');
        expect(this.varys.tokens[Tokens.gold]).toBe(1);
    });
});
