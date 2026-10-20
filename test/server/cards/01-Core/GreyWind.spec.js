describe('Grey Wind (Core)', function () {
    describe('when you do not control Robb Stark', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Grey Wind (Core)', 'Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Samwell Tarly (Core)', 'Bastard in Hiding', 'Robb Stark (Core)']
                }
            });

            this.player1.clickMenu(this.greyWind, 'Kneel Grey Wind to kill a character');
        });

        it('can only choose a character with STR 1 or lower', function () {
            expect(this.player1).toBeAbleToSelect(this.samwellTarly);
            expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.robbStark);
            expect(this.player1).not.toBeAbleToSelect(this.greyWind);
        });

        it('kneels Grey Wind and kills the character', function () {
            this.player1.clickCard(this.samwellTarly);

            expect(this.greyWind.kneeled).toBe(true);
            expect(this.samwellTarly.location).toBe('dead pile');
            expect(this.bastardInHiding.location).toBe('play area');
            expect(this.tumblestoneKnight.location).toBe('play area');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels Grey Wind to kill Samwell Tarly'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when you control Robb Stark', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Grey Wind (Core)', 'Robb Stark (Core)', 'Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Samwell Tarly (Core)', 'Bastard in Hiding', 'Braided Warrior']
                }
            });

            this.player1.clickMenu(this.greyWind, 'Kneel Grey Wind to kill a character');
        });

        it('can choose a character with STR 2 or lower', function () {
            expect(this.player1).toBeAbleToSelect(this.samwellTarly);
            expect(this.player1).toBeAbleToSelect(this.bastardInHiding);
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.braidedWarrior);
            expect(this.player1).not.toBeAbleToSelect(this.robbStark);
            expect(this.player1).not.toBeAbleToSelect(this.greyWind);
        });

        it('kills a STR 2 character', function () {
            this.player1.clickCard(this.bastardInHiding);

            expect(this.bastardInHiding.location).toBe('dead pile');
            expect(this.samwellTarly.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('outside the challenges phase', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Grey Wind (Core)']
                },
                player2: {
                    inPlay: ['Samwell Tarly (Core)']
                }
            });
        });

        it('cannot be used', function () {
            expect(this.player1.actionUnavailableReason(this.greyWind)).toBe('phase');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
