describe('Arstan Whitebeard', function () {
    describe('when you marshal Ser Barristan Selmy', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'targaryen',
                    gold: 5,
                    hand: ['Ser Barristan Selmy (LoCR)'],
                    inPlay: ['Arstan Whitebeard']
                }
            });

            this.player1.clickCard(this.serBarristanSelmy);
        });

        it('sacrifices Arstan Whitebeard', function () {
            expect(this.arstanWhitebeard.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Arstan Whitebeard as they control Ser Barristan Selmy'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent controls Ser Barristan Selmy', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'targaryen',
                    gold: 1,
                    hand: ['Arstan Whitebeard']
                },
                player2: {
                    inPlay: ['Ser Barristan Selmy (LoCR)']
                }
            });

            this.player1.clickCard(this.arstanWhitebeard);
        });

        it('stays in play', function () {
            expect(this.arstanWhitebeard.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control no Lord or Lady characters', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    inPlay: ['Arstan Whitebeard', 'House Maester']
                }
            });

            this.player1.clickPrompt('Intrigue');
        });

        it('cannot kneel, so cannot be declared as an attacker', function () {
            expect(this.player1).not.toBeAbleToSelect(this.arstanWhitebeard);
            expect(this.player1).toBeAbleToSelect(this.houseMaester);

            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('while you control a Lady character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'targaryen',
                    inPlay: ['Arstan Whitebeard', 'Dacey Mormont']
                }
            });

            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.arstanWhitebeard);
            this.player1.clickPrompt('Done');
        });

        it('kneels to attack', function () {
            expect(this.arstanWhitebeard.kneeled).toBe(true);
            expect(this.arstanWhitebeard.isAttacking()).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
