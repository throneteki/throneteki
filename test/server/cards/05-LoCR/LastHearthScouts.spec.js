describe('Last Hearth Scouts', function () {
    describe('when a character enters play during the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Last Hearth Scouts']
                },
                player2: {
                    faction: 'lannister',
                    gold: 2,
                    hand: ['Burned Men']
                }
            });

            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.burnedMen);
        });

        it('kneels that character', function () {
            expect(this.burnedMen.location).toBe('play area');
            expect(this.burnedMen.kneeled).toBe(true);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 is forced by Last Hearth Scouts to kneel Burned Men'
            );
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when a character enters play in another phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    gold: 2,
                    hand: ['Tumblestone Knight'],
                    inPlay: ['Last Hearth Scouts']
                }
            });

            this.player1.clickCard(this.tumblestoneKnight);
        });

        it('does not kneel it', function () {
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.tumblestoneKnight.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
