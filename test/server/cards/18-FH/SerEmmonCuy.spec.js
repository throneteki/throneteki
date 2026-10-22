describe('Ser Emmon Cuy (FH)', function () {
    function setup(gold) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Ser Emmon Cuy (FH)', gold }] }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.serEmmonCuy);
        this.player1.clickPrompt('Done');
        this.player1.triggerAbility('Ser Emmon Cuy');
    }

    it('discards 1 gold to raise your claim, then kills him if he has no gold left', function () {
        setup.call(this, 1);
        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.serEmmonCuy.location).toBe('dead pile');
    });

    it('does not kill him while he still has gold', function () {
        setup.call(this, 2);
        expect(this.player1Object.getClaim()).toBe(2);
        expect(this.serEmmonCuy.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
