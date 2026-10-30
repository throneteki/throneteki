describe('Winterfell Castle', function () {
    describe('during a power challenge with 2 unique participating stark characters', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        'Winterfell Castle (TRtW)',
                        'Catelyn Stark (Core)',
                        'Maester Luwin',
                        'Tumblestone Knight'
                    ]
                }
            });
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.catelynStark);
            this.player1.clickCard(this.maesterLuwin);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
        });

        it('gives each of those characters +2 STR', function () {
            expect(this.catelynStark.getStrength()).toBe(6);
            expect(this.maesterLuwin.getStrength()).toBe(4);
            expect(this.tumblestoneKnight.getStrength()).toBe(2);
        });
    });
});
