describe('Lannisport (WAID)', function () {
    function setup(hand) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Lannisport (WAID)'] },
            player2: { inPlay: ['Courtesan of the Rose'], hand }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.courtesanOfTheRose);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('Lannisport');
    }

    it('kneels to end a power challenge against you unless the attacker discards a card', function () {
        setup.call(this, ['Castle Guard']);
        this.player2.clickPrompt('No');
        expect(this.lannisport.kneeled).toBe(true);
        expect(this.courtesanOfTheRose.isAttacking()).toBe(false);
    });

    it('lets the challenge continue if they discard a card', function () {
        setup.call(this, ['Castle Guard']);
        this.player2.clickPrompt('Yes');
        this.player2.clickCard(this.castleGuard);
        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.courtesanOfTheRose.isAttacking()).toBe(true);
    });

    it('ends the challenge if they have no cards in hand', function () {
        setup.call(this, []);
        expect(this.courtesanOfTheRose.isAttacking()).toBe(false);
    });
});
