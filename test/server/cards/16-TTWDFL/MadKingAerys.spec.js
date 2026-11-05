describe('Mad King Aerys', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Mad King Aerys'] },
            player2: { inPlay: ['Tumblestone Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.tumblestoneKnight);
    });

    it('cannot be killed while no opponent controls a Lord, Lady or Ser Jaime Lannister', function () {
        expect(this.madKingAerys.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('Mad King Aerys', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Mad King Aerys'] },
            player2: { inPlay: ['Eddard Stark (Core)'] }
        });
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.madKingAerys);
        this.player1.clickCard(this.eddardStark);
    });

    it('kneels to kill a Lord or Lady character during the dominance phase', function () {
        expect(this.madKingAerys.kneeled).toBe(true);
        expect(this.eddardStark.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
