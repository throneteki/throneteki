import { Tokens } from '../../../../server/game/Constants/index.js';

describe('Sunspear (BtB)', function () {
    it('gains 2 gold after a Lord or Lady Martell character enters play under your control', function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Sunspear (BtB)'], hand: ['Doran Martell (SoD)'], gold: 10 }
        });
        this.player1.clickCard(this.doranMartell);
        this.player1.triggerAbility('Sunspear');
        expect(this.sunspear.tokens[Tokens.gold]).toBe(2);
    });

    it('lets you spend its gold during the challenges phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                inPlay: [{ card: 'Sunspear (BtB)', tokens: { [Tokens.gold]: 2 } }],
                hand: ['A Dragon Is No Slave'],
                gold: 0
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickCard(this.aDragonIsNoSlave);
        this.player1.clickCard(this.hedgeKnight);
        expect(this.hedgeKnight.getStrength()).toBe(this.hedgeKnight.getPrintedStrength() - 2);
        expect(this.sunspear.hasToken(Tokens.gold)).toBe(false);
    });
});
