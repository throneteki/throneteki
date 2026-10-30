describe('Kingsgrave', function () {
    function setup(attacker) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Kingsgrave'] },
            player2: { inPlay: [attacker] }
        });
        this.player1.clickPrompt('Done');
        this.attacker = this.player2.findCardByName(attacker);
        this.unopposedChallenge(this.player2, 'Power', this.attacker);
        this.player1.triggerAbility('Kingsgrave');
        this.player1.clickCard(this.attacker);
    }

    it('kneels and sacrifices itself after you lose a power challenge by 5 to return a participating character to hand', function () {
        setup.call(this, 'Ranging Party');
        expect(this.kingsgrave.location).toBe('discard pile');
        expect(this.attacker.location).toBe('hand');
    });

    it('may kill a King instead', function () {
        setup.call(this, 'Robert Baratheon (Core)');
        this.player1.clickPrompt('Yes');
        expect(this.attacker.location).toBe('dead pile');
    });

    it('may still return a King to hand', function () {
        setup.call(this, 'Robert Baratheon (Core)');
        this.player1.clickPrompt('No');
        expect(this.attacker.location).toBe('hand');
    });
});
