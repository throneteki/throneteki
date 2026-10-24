describe('A Dragon Is No Slave', function () {
    it('gives a character without attachments -2 STR until the end of the phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['A Dragon Is No Slave'] },
            player2: { inPlay: ['Robb Stark (Core)'] }
        });
        this.player1.clickCard(this.aDragonIsNoSlave);
        this.player1.clickCard(this.robbStark);
        expect(this.robbStark.getStrength()).toBe(this.robbStark.getPrintedStrength() - 2);
    });

    it('pays 1 gold to return to your hand after you win a challenge with a participating Dragon', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { discard: ['A Dragon Is No Slave'], inPlay: ['Drogon (Core)'], gold: 1 }
        });
        this.unopposedChallenge(this.player1, 'Military', this.drogon);
        this.player1.triggerAbility('A Dragon Is No Slave');
        expect(this.aDragonIsNoSlave.location).toBe('hand');
        expect(this.player1Object.gold).toBe(0);
    });
});
