describe('Aeron Damphair (TIMC)', function () {
    function setup(kneeling) {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Aeron Damphair (TIMC)', 'Hedge Knight'] },
            player2: { inPlay: [{ card: 'Maester Aemon (Core)', dupes: 1, kneeling }] }
        });
        this.unopposedChallenge(this.player1, 'Military', this.hedgeKnight);
        this.player2.clickCard(this.maesterAemon);
        if (!kneeling) {
            this.player2.clickPrompt('Pass');
        }
        this.player1.triggerAbility('Aeron Damphair');
    }

    it('lets you stand a kneeling saved character', function () {
        setup.call(this, true);
        this.player1.clickPrompt('Stand');
        expect(this.maesterAemon.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('lets you kneel a standing saved character', function () {
        setup.call(this, false);
        this.player1.clickPrompt('Kneel');
        expect(this.maesterAemon.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
