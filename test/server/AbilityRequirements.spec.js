describe('why an ability is unavailable', function () {
    describe('an action restricted to a phase, with a cost and a target', function () {
        describe('outside its phase', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'marshal',
                    player1: { inPlay: ['Grey Wind (Core)', 'Old Forest Hunter'] }
                });
            });

            it('reports the phase', function () {
                expect(this.player1.actionUnavailableReason(this.greyWind)).toBe('phase');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('in its phase', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'challenge',
                    player1: {
                        inPlay: ['Grey Wind (Core)', { card: 'Old Forest Hunter', kneeling: true }]
                    }
                });
            });

            it('reports nothing when it can be used', function () {
                expect(this.player1.actionUnavailableReason(this.greyWind)).toBeUndefined();
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when its cost cannot be paid', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'challenge',
                    player1: {
                        inPlay: [{ card: 'Grey Wind (Core)', kneeling: true }, 'Old Forest Hunter']
                    }
                });
            });

            it('reports the cost', function () {
                expect(this.player1.actionUnavailableReason(this.greyWind)).toBe('cost');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when there is nothing to target', function () {
            beforeEach(function () {
                this.setupTest({
                    phase: 'challenge',
                    player1: { inPlay: ['Grey Wind (Core)'] },
                    player2: { inPlay: ['House Dayne Knight'] }
                });
            });

            it('reports the target', function () {
                expect(this.player1.actionUnavailableReason(this.greyWind)).toBe('target');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('an action with a limit', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    inPlay: ['Old Forest Hunter'],
                    hand: ['Bastard in Hiding', 'House Dayne Knight']
                }
            });
        });

        it('reports the limit once it has been used', function () {
            expect(this.player1.actionUnavailableReason(this.oldForestHunter)).toBeUndefined();

            this.player1.clickMenu(this.oldForestHunter, 'Discard a card to gain 1 gold');
            this.player1.clickCard(this.bastardInHiding);

            expect(this.bastardInHiding.location).toBe('discard pile');
            expect(this.player1.actionUnavailableReason(this.oldForestHunter)).toBe('limit');
            expect(this.oldForestHunter.getMenu(this.player1.player)).toEqual([
                expect.objectContaining({ disabled: true, disabledReason: 'limit' })
            ]);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('an action with a cost in hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: { inPlay: ['Old Forest Hunter'] }
            });
        });

        it('reports the cost when the hand is empty', function () {
            expect(this.player1.actionUnavailableReason(this.oldForestHunter)).toBe('cost');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
