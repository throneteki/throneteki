describe('Fire and Blood', function () {
    it('shuffles a unique Targaryen character from your dead pile back into your deck', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { hand: ['Fire and Blood'], deadPile: ['Daenerys Targaryen (Core)'] }
        });
        this.player1.clickCard(this.fireAndBlood);
        this.player1.clickCard(this.daenerysTargaryen);
        expect(this.daenerysTargaryen.location).toBe('draw deck');
    });

    describe('when it is a Hatchling', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { hand: ['Fire and Blood'], deadPile: ['Drogon (Core)'] }
            });
            this.player1.clickCard(this.fireAndBlood);
            this.player1.clickCard(this.drogon);
        });

        it('may put it into play instead', function () {
            this.player1.clickPrompt('Yes');
            expect(this.drogon.location).toBe('play area');
        });

        it('may still shuffle it into your deck', function () {
            this.player1.clickPrompt('No');
            expect(this.drogon.location).toBe('draw deck');
        });
    });
});
