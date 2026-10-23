describe("The Bastard's Letter", function () {
    function setup(kneeling) {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Vanguard of the North', kneeling },
                    { card: 'Robb Stark (Core)', kneeling }
                ],
                shadows: ["The Bastard's Letter"],
                gold: 3
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility("The Bastard's Letter");
    }

    it('can be triggered with no kneeling characters, and kills each attacker if you win', function () {
        setup.call(this, false);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.robbStark);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.hedgeKnight.location).toBe('dead pile');
    });

    describe('with kneeling characters', function () {
        beforeEach(function () {
            setup.call(this, true);
        });

        it('stands any number of your characters with a military icon, then kills each attacker if you win', function () {
            this.player1.clickCard(this.vanguardOfTheNorth);
            this.player1.clickCard(this.robbStark);
            this.player1.clickPrompt('Done');
            expect(this.vanguardOfTheNorth.kneeled).toBe(false);
            expect(this.robbStark.kneeled).toBe(false);
            this.skipActionWindow();
            this.player1.clickCard(this.robbStark);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            expect(this.hedgeKnight.location).toBe('dead pile');
        });
    });
});
