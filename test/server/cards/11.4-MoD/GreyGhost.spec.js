describe('Grey Ghost', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Grey Ghost', 'Hedge Knight'] },
            player2: { inPlay: ['Castle Guard', 'Winterfell Steward'] }
        });
        this.player1.clickMenu(this.greyGhost, 'Prevent character(s) from defending');
        this.player1.clickCard(this.castleGuard);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.hedgeKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
    });

    it('kneels to make a character unable to be declared as a defender until the end of the phase', function () {
        expect(this.greyGhost.kneeled).toBe(true);
        expect(this.player2).not.toAllowSelect(this.castleGuard);
    });
});

describe('Grey Ghost choosing characters', function () {
    describe('when it is already in play', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Grey Ghost', 'Hedge Knight'] },
                player2: { inPlay: ['Castle Guard', 'Tumblestone Knight'] }
            });
            this.player1.clickMenu(this.greyGhost, 'Prevent character(s) from defending');
        });

        it('chooses 1 character and names it in the message', function () {
            expect(this.player1).toBeAbleToSelect(this.castleGuard);
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).toBeAbleToSelect(this.hedgeKnight);
            expect(this.player1).not.toBeAbleToSelect(this.greyGhost);

            this.player1.clickCard(this.castleGuard);
            this.player1.clickPrompt('Done');

            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels Grey Ghost to make Castle Guard unable to be declared as a defender'
            );

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player2).not.toBeAbleToSelect(this.castleGuard);
            expect(this.player2).toBeAbleToSelect(this.tumblestoneKnight);

            this.player2.clickCard(this.tumblestoneKnight);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.castleGuard);

            expect(this.castleGuard.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when it came out of shadows this phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { inPlay: ['Hedge Knight'], shadows: ['Grey Ghost'], gold: 2 },
                player2: { inPlay: ['Castle Guard', 'Tumblestone Knight'] }
            });
            this.player1.clickCard(this.greyGhost);
            this.player1.clickMenu(this.greyGhost, 'Prevent character(s) from defending');
        });

        it('chooses up to 2 characters and names them in the message', function () {
            this.player1.clickCard(this.castleGuard);
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');

            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels Grey Ghost to make Castle Guard and Tumblestone Knight unable to be declared as defenders'
            );

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.hedgeKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();

            expect(this.player2).not.toBeAbleToSelect(this.castleGuard);
            expect(this.player2).not.toBeAbleToSelect(this.tumblestoneKnight);

            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.castleGuard);

            expect(this.castleGuard.location).toBe('dead pile');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
