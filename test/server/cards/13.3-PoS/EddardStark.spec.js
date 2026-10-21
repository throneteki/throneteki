describe('Eddard Stark (PoS)', function () {
    describe('when each character you control is [stark]', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Eddard Stark (PoS)', 'Tumblestone Knight']
                },
                player2: {
                    inPlay: ['Ranging Party', 'Magister Illyrio (Core)', 'Bastard in Hiding']
                }
            });

            this.player1.togglePromptedActionWindow('dominance', true);
        });

        it('cannot be used outside the dominance phase', function () {
            expect(this.player1.actionUnavailableReason(this.eddardStark)).toBe('phase');
            expect(this.player1).isReadyToTakeAction();
        });

        describe('when used in the dominance phase', function () {
            beforeEach(function () {
                this.completeChallengesPhase();
                this.player1.clickMenu(this.eddardStark, 'Kill a character');
            });

            it('can only choose a character with printed cost 4 or lower', function () {
                expect(this.player1).toBeAbleToSelect(this.rangingParty);
                expect(this.player1).toBeAbleToSelect(this.bastardInHiding);
                expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
                expect(this.player1).not.toBeAbleToSelect(this.magisterIllyrio);
                expect(this.player1).not.toBeAbleToSelect(this.eddardStark);
            });

            it('kneels Eddard Stark and kills the character', function () {
                this.player1.clickCard(this.rangingParty);

                expect(this.eddardStark.kneeled).toBe(true);
                expect(this.rangingParty.location).toBe('dead pile');
                expect(this.bastardInHiding.location).toBe('play area');
                expect(this.game.getPlainTextLog()).toContain(
                    'player1 kneels Eddard Stark to kill Ranging Party'
                );
                expect(this.player2).isReadyToTakeAction();
            });

            it('cannot be used again in the same phase', function () {
                this.player1.clickCard(this.rangingParty);
                this.player2.clickMenu(this.magisterIllyrio, 'Stand a character');
                this.player2.clickCard(this.eddardStark);

                expect(this.eddardStark.kneeled).toBe(false);
                expect(this.player1.actionUnavailableReason(this.eddardStark)).toBe('limit');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when you control a non-[stark] character', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Eddard Stark (PoS)', 'House Maester']
                },
                player2: {
                    inPlay: ['Bastard in Hiding']
                }
            });

            this.player1.togglePromptedActionWindow('dominance', true);
            this.completeChallengesPhase();
        });

        it('cannot be used', function () {
            expect(this.player1.actionUnavailableReason(this.eddardStark)).toBe('condition');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
