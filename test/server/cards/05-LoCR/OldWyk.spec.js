describe('Old Wyk', function () {
    function setup(context, defender) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: ['Old Wyk', 'Tumblestone Knight'],
                deadPile: ['Drowned Disciple (AMAF)', 'Iron Islands Fishmonger', 'Drowned Men']
            },
            player2: { inPlay: defender ? [defender] : [] }
        });
        context.player1.clickPrompt('Power');
        context.player1.clickCard(context.tumblestoneKnight);
        context.player1.clickPrompt('Done');
        context.player1.triggerAbility('Old Wyk');
    }

    it('kneels to put the top Drowned God character in your dead pile into play knelt, participating as an attacker', function () {
        setup(this);
        expect(this.oldWyk.kneeled).toBe(true);
        expect(this.drownedMen.location).toBe('play area');
        expect(this.drownedMen.kneeled).toBe(true);
        expect(this.drownedMen.isAttacking()).toBe(true);
        expect(this.drownedDisciple.location).toBe('dead pile');
    });

    it('returns that character to your hand if you win by 5 or more STR', function () {
        setup(this);
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.drownedMen.location).toBe('hand');
    });

    it('otherwise places it on the bottom of your deck', function () {
        setup(this, 'Robb Stark (Core)');
        this.skipActionWindow();
        this.player2.clickCard(this.robbStark);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.drownedMen.location).toBe('draw deck');
        expect(this.player1Object.drawDeck.at(-1)).toBe(this.drownedMen);
    });
});
