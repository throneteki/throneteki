describe('Grey Galley (MaV)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Tumblestone Knight']
            },
            player2: {
                inPlay: ['Grey Galley (MaV)', 'Bastard in Hiding']
            }
        });

        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.bastardInHiding);
        this.player2.clickPrompt('Done');
    });

    it('contributes 1 STR to your side while you control a defending character', function () {
        expect(this.game.currentChallenge.defenderStrength).toBe(3);

        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Grey Galley (MaV) out of shadows', function () {
    describe('when it came out of shadows this phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Bastard in Hiding'],
                    shadows: ['Grey Galley (MaV)'],
                    gold: 1
                }
            });

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.greyGalley);
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
        });

        it('contributes 3 STR to your side while you control a defending character', function () {
            expect(this.greyGalley.location).toBe('play area');
            expect(this.game.currentChallenge.attackerStrength).toBe(2);
            expect(this.game.currentChallenge.defenderStrength).toBe(5);

            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when it came out of shadows in an earlier phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                firstPlayer: 'player2',
                player1: {
                    inPlay: ['Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Bastard in Hiding'],
                    shadows: ['Grey Galley (MaV)']
                }
            });

            this.player2.clickCard(this.greyGalley);
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
        });

        it('contributes 1 STR to your side', function () {
            expect(this.greyGalley.location).toBe('play area');
            expect(this.game.currentChallenge.defenderStrength).toBe(3);

            this.skipActionWindow();

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
