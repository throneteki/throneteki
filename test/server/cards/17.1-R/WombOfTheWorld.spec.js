describe('Womb of the World (R)', function () {
    function setup({ inPlay = [], drawDeck, deadPile = [] }) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Womb of the World (R)', ...inPlay],
                drawDeck,
                deadPile
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickMenu(this.wombOfTheWorld, 'Reveal top 5 cards');
    }

    function killWithClaim(card) {
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.hedgeKnight);
        this.player1.clickCard(card);
    }

    describe('when putting out a character', function () {
        beforeEach(function () {
            setup.call(this, { drawDeck: ['Qotho (HoT)'] });
            this.player1.clickCard(this.qotho);
        });

        it('puts the character into play', function () {
            expect(this.qotho.location).toBe('play area');
        });

        it('returns it to hand at the end of the phase', function () {
            this.completeChallengesPhase();
            expect(this.qotho.location).toBe('hand');
        });

        it('does not return it to hand if it left play before the phase ends', function () {
            killWithClaim.call(this, this.qotho);
            this.player2.clickPrompt('Done');
            expect(this.qotho.location).toBe('dead pile');
        });
    });

    describe('when putting out a duplicate', function () {
        beforeEach(function () {
            setup.call(this, { inPlay: ['Qotho (HoT)'], drawDeck: ['Qotho (HoT)'] });
            this.character = this.player1.findCardByName('Qotho', 'play area');
            this.dupe = this.player1.findCardByName('Qotho', 'draw deck');
            this.player1.clickCard(this.dupe);
        });

        it('duplicates the character', function () {
            expect(this.character.dupes).toContain(this.dupe);
            expect(this.dupe.location).toBe('duplicate');
        });

        it('returns the dupe to hand at the end of the phase', function () {
            this.completeChallengesPhase();
            expect(this.character.dupes).not.toContain(this.dupe);
            expect(this.dupe.location).toBe('hand');
        });

        it('does not return the dupe to hand if it left play before the phase ends', function () {
            killWithClaim.call(this, this.character);
            this.player2.clickPrompt('Done');
            expect(this.dupe.location).not.toBe('hand');
        });
    });

    describe('when several Dothraki characters are revealed', function () {
        it('puts the one with the lowest printed cost into play', function () {
            setup.call(this, { drawDeck: ['Qotho (HoT)', 'Rakharo (DotE)'] });
            expect(this.player1).not.toAllowSelect(this.qotho);
            this.player1.clickCard(this.rakharo);
            expect(this.rakharo.location).toBe('play area');
        });

        it('ignores a character with a lower printed cost that is not eligible', function () {
            setup.call(this, {
                drawDeck: ['Qotho (HoT)', 'Rakharo (DotE)'],
                deadPile: ['Rakharo (DotE)']
            });
            this.player1.clickCard(this.qotho);
            expect(this.qotho.location).toBe('play area');
        });
    });
});
