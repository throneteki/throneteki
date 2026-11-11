describe('The King in the North (FotOG)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'The King in the North (FotOG)',
                inPlay: ['Heart Tree Grove', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Robert Baratheon (LMHR)', 'The Kingsroad']
            }
        });
    });

    it('stops a player who controls no King character triggering abilities on characters, locations and attachments', function () {
        expect(this.player1.actionUnavailableReason(this.heartTreeGrove)).toBe('cannotTrigger');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not stop a player who controls a King character', function () {
        this.player1.clickPrompt('Done');

        expect(this.player2.actionUnavailableReason(this.theKingsroad)).toBeUndefined();
        expect(this.player2).isReadyToTakeAction();
    });
});
