describe('Northern Encampment', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Northern Encampment'], gold: 0 } });
        this.player1.clickCard(this.northernEncampment);
    });

    it('kneels to gain 2 gold during the marshaling phase', function () {
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Northern Encampment', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Northern Encampment', kneeling: true }], gold: 0 },
            player2: { inPlay: ['Khal Drogo (Core)'] }
        });
        this.player1.togglePromptedActionWindow('standing', true);
        this.completeChallengesPhase();
    });

    it('does not stand during the standing phase unless you won dominance', function () {
        expect(this.northernEncampment.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Northern Encampment dominance restriction', function () {
    it('stands during standing when its controller won dominance this round', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Northern Encampment', kneeling: true }, 'Hedge Knight'],
                gold: 0
            },
            player2: { gold: 0 }
        });
        this.player1.togglePromptedActionWindow('standing', true);
        this.completeChallengesPhase();
        expect(this.northernEncampment.kneeled).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot gain gold outside the marshaling phase', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Northern Encampment'], gold: 0 }
        });
        expect(this.player1.actionUnavailableReason(this.northernEncampment)).toBe('phase');
        expect(this.northernEncampment.kneeled).toBe(false);
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
