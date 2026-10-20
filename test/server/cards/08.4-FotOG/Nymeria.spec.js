describe('Nymeria (FotOG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Nymeria (FotOG)',
                    'Direwolf Pup',
                    'Grey Wind (Core)',
                    'Tumblestone Knight'
                ]
            },
            player2: {
                inPlay: ['Bastard in Hiding', 'Ranging Party']
            }
        });
    });

    it('cannot be used outside a challenge', function () {
        expect(this.player1.actionUnavailableReason(this.nymeria)).toBe('condition');
        expect(this.player1).isReadyToTakeAction();
    });

    describe('during a challenge in which you control a participating [stark] character', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.tumblestoneKnight);
            this.player1.clickPrompt('Done');
            this.player1.clickMenu(this.nymeria, 'Add Direwolfs to challenge');
        });

        it('can kneel any number of other Direwolf characters', function () {
            expect(this.player1).toBeAbleToSelect(this.direwolfPup);
            expect(this.player1).toBeAbleToSelect(this.greyWind);
            expect(this.player1).not.toBeAbleToSelect(this.nymeria);
            expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.bastardInHiding);
        });

        it('has Nymeria and each knelt Direwolf participate on your side', function () {
            this.player1.clickCard(this.direwolfPup);
            this.player1.clickPrompt('Done');

            expect(this.nymeria.kneeled).toBe(true);
            expect(this.direwolfPup.kneeled).toBe(true);
            expect(this.greyWind.kneeled).toBe(false);
            expect(this.game.currentChallenge.isAttacking(this.nymeria)).toBe(true);
            expect(this.game.currentChallenge.isAttacking(this.direwolfPup)).toBe(true);
            expect(this.game.currentChallenge.isAttacking(this.tumblestoneKnight)).toBe(true);
            expect(this.greyWind.isParticipating()).toBe(false);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 kneels Nymeria, and Direwolf Pup to have them participate in the challenge on their side'
            );
            expect(this.player2).toHavePrompt('Initiate an action');
        });

        it('has only Nymeria participate when no other Direwolf is knelt', function () {
            this.player1.clickPrompt('Done');

            expect(this.nymeria.kneeled).toBe(true);
            expect(this.game.currentChallenge.isAttacking(this.nymeria)).toBe(true);
            expect(this.direwolfPup.isParticipating()).toBe(false);
            expect(this.player2).toHavePrompt('Initiate an action');
        });
    });

    describe('during a challenge in which you control no participating [stark] character', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.bastardInHiding);
            this.player2.clickPrompt('Done');
        });

        it('cannot be used', function () {
            expect(this.player1.actionUnavailableReason(this.nymeria)).toBe('condition');
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
