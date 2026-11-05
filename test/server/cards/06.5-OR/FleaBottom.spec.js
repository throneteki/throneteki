describe('Flea Bottom (OR)', function () {
    function setup(context, inPlay = []) {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Flea Bottom (OR)', ...inPlay], discard: ['Drogon (Core)'] },
            player2: { inPlay: ['Castle Guard'] }
        });
        context.player1.togglePromptedActionWindow('dominance', true);
        context.drogon = context.player1.findCardByName('Drogon', 'discard pile');
        context.player1.clickMenu(context.fleaBottom, 'Put character into play');
        context.player1.clickCard(context.drogon);
    }

    function killDrogon(context) {
        context.player1.clickPrompt('Done');
        context.unopposedChallenge(context.player2, 'Military', context.castleGuard);
        context.player1.clickCard(context.inPlayDrogon || context.drogon);
    }

    describe('when putting out a character', function () {
        beforeEach(function () {
            setup(this);
        });

        it('pays 1 gold and kneels to put a character from your discard pile into play', function () {
            expect(this.drogon.location).toBe('play area');
            expect(this.fleaBottom.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('places the character on the bottom of your deck if it is in play when the phase ends', function () {
            this.completeChallengesPhase();

            expect(this.drogon.location).toBe('draw deck');
            expect(this.player1Object.drawDeck.slice(-1)[0]).toBe(this.drogon);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not place the character in your deck if it leaves play before the phase ends', function () {
            killDrogon(this);
            this.player2.clickPrompt('Done');

            expect(this.drogon.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when putting out a duplicate', function () {
        beforeEach(function () {
            setup(this, ['Drogon (Core)']);
            this.inPlayDrogon = this.player1.findCardByName('Drogon', 'play area');
        });

        it('duplicates the character', function () {
            expect(this.inPlayDrogon.dupes).toContain(this.drogon);
            expect(this.drogon.location).toBe('duplicate');
            expect(this.player1).isReadyToTakeAction();
        });

        it('removes the dupe and places it on the bottom of your deck when the phase ends', function () {
            this.completeChallengesPhase();

            expect(this.inPlayDrogon.dupes).not.toContain(this.drogon);
            expect(this.drogon.location).toBe('draw deck');
            expect(this.player1Object.drawDeck.slice(-1)[0]).toBe(this.drogon);
            expect(this.player1).isReadyToTakeAction();
        });

        it('does not place the dupe in your deck if it leaves play before the phase ends', function () {
            killDrogon(this);
            this.player2.clickPrompt('Done');

            expect(this.drogon.location).not.toBe('draw deck');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
