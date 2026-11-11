describe('Baelor Brightsmile', function () {
    function setup(defenders) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Baelor Brightsmile'], drawDeck: ['Hedge Knight'] },
            player2: { inPlay: defenders }
        });
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.baelorBrightsmile);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        if (defenders.length > 0) {
            this.player2.clickCard(this.castleGuard);
        }
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
    }

    describe('after winning a challenge by 5 or more STR', function () {
        beforeEach(function () {
            setup.call(this, []);
            this.player1.triggerAbility('Baelor Brightsmile');
        });

        it('reveals the top card of your deck and lets you place it facedown as a duplicate', function () {
            this.player1.clickPrompt('Yes');
            expect(this.hedgeKnight.location).toBe('duplicate');
            expect(this.hedgeKnight.facedown).toBe(true);
            expect(this.baelorBrightsmile.dupes).toContain(this.hedgeKnight);
        });

        it('lets you leave it on your deck', function () {
            this.player1.clickPrompt('No');
            expect(this.hedgeKnight.location).toBe('draw deck');
        });
    });

    it('does not trigger after winning by less than 5 STR', function () {
        setup.call(this, ['Castle Guard']);
        expect(this.player1).not.toAllowAbilityTrigger('Baelor Brightsmile');
    });
});
