describe('My Mind Is My Weapon', function () {
    describe('during a military challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Tumblestone Knight', 'Maester Luwin'],
                    hand: ['My Mind Is My Weapon']
                }
            });
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.myMindIsMyWeapon);
            this.player1.clickCard(this.maesterLuwin);
        });

        it('has a character with an intrigue icon participate on your side', function () {
            expect(this.maesterLuwin.isAttacking()).toBe(true);
        });
    });
});
