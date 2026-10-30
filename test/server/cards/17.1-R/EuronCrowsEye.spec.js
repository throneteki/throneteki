describe("Euron Crow's Eye (R)", function () {
    function setup(player1) {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ["Euron Crow's Eye (R)"], gold: 10, ...player1 }
        });
        this.player1.clickCard(this.euronCrowsEye);
        this.player1.triggerAbility("Euron Crow's Eye");
    }

    it('puts a Warship location from your hand into play after it enters play', function () {
        setup.call(this, { hand: ["Euron Crow's Eye (R)", 'Great Kraken'] });
        this.player1.clickPrompt('Put Warship into play');
        this.player1.clickCard(this.greatKraken);
        expect(this.greatKraken.location).toBe('play area');
    });

    it('or searches your deck for Silence', function () {
        setup.call(this, { drawDeck: ['Silence (JS)'] });
        this.player1.clickPrompt('Search for Silence');
        this.player1.clickCard(this.silence);
        expect(this.silence.location).toBe('hand');
    });

    it('gains intimidate while you control another Raider character', function () {
        setup.call(this, { inPlay: ['Raider from Pyke (CoW)'], drawDeck: ['Silence (JS)'] });
        this.player1.clickPrompt('Search for Silence');
        this.player1.clickCard(this.silence);
        expect(this.euronCrowsEye.hasKeyword('intimidate')).toBe(true);
    });
});
