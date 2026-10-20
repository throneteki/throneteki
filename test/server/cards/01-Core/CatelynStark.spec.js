describe('Catelyn Stark (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                gold: 2,
                inPlay: ['Catelyn Stark (Core)', 'House Maester', 'Magister Illyrio (Core)']
            },
            player2: {
                gold: 2,
                inPlay: ['Janos Slynt (AtSK)', 'Bastard in Hiding']
            }
        });
    });

    describe('while she is participating in a challenge', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.catelynStark);
            this.player1.clickPrompt('Done');
        });

        it('stops opponents triggering card abilities, but not you', function () {
            expect(this.player2.actionUnavailableReason(this.janosSlynt)).toBe('cannotTrigger');
            expect(this.player1.actionUnavailableReason(this.magisterIllyrio)).toBeUndefined();
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('while she is not participating in a challenge', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.houseMaester);
            this.player1.clickPrompt('Done');
        });

        it('does not stop opponents triggering card abilities', function () {
            expect(this.player2.actionUnavailableReason(this.janosSlynt)).toBeUndefined();
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
