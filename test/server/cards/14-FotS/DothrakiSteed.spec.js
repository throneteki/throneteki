describe('Dothraki Steed', function () {
    function attackWith(character) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: character, attachments: ['Dothraki Steed'] }] }
        });
        this.character = this.player1.findCardByName(character);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.character);
        this.player1.clickPrompt('Done');
    }

    it('gives the attached character +1 STR while it is attacking', function () {
        attackWith.call(this, 'Hedge Knight');
        expect(this.character.getStrength()).toBe(this.character.getPrintedStrength() + 1);
    });

    it('gives +3 STR instead to a Dothraki character', function () {
        attackWith.call(this, 'Khal Drogo (Core)');
        expect(this.character.getStrength()).toBe(this.character.getPrintedStrength() + 3);
    });
});
