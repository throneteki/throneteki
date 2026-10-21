describe('Drogon (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Drogon (DotE)', 'Daenerys Targaryen (Core)']
            },
            player2: {
                inPlay: ['Steward at the Wall', 'Lannisport Merchant']
            }
        });
    });

    it('gives each Stormborn character you control renown', function () {
        expect(this.daenerysTargaryen.hasKeyword('Renown')).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('kills each character the defending player controls with STR 1 or lower after you win a challenge he attacks in', function () {
        this.unopposedChallenge(this.player1, 'Military', this.drogon);
        this.player1.triggerAbility(this.drogon);

        this.player2.clickPrompt('Done');

        expect(this.stewardAtTheWall.location).toBe('dead pile');
        expect(this.lannisportMerchant.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });
});
