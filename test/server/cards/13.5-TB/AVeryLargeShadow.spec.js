describe('A Very Large Shadow', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                shadows: ['A Very Large Shadow', 'Covert Loyalist', 'Ser Jorah Mormont (LMHR)'],
                gold: 5
            },
            player2: { shadows: ['House Umber Berserkers'], gold: 1 }
        });
        this.player1.clickCard(this.aVeryLargeShadow);
    });

    it('reduces only your next shadow cost by three', function () {
        expect(this.aVeryLargeShadow.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(5);
        this.player1.clickCard(this.serJorahMormont);
        expect(this.serJorahMormont.location).toBe('play area');
        expect(this.player1Object.gold).toBe(4);
        this.player1.clickCard(this.covertLoyalist);
        expect(this.covertLoyalist.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.houseUmberBerserkers);
        expect(this.houseUmberBerserkers.location).toBe('play area');
        expect(this.player2Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('expires the unused reduction at phase end', function () {
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        this.player1.clickCard(this.serJorahMormont);
        expect(this.serJorahMormont.location).toBe('play area');
        expect(this.player1Object.gold).toBe(1);
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('A Very Large Shadow with a Scheme revealed', function () {
    it('returns to hand instead of the discard pile and cannot be played twice in the phase', function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                shadows: ['A Very Large Shadow', 'A Very Large Shadow', 'Ser Jorah Mormont (LMHR)'],
                gold: 1
            },
            player2: { plot: 'A Game of Thrones' }
        });
        const shadows = this.player1Object.shadows.filter(
            (card) => card.name === 'A Very Large Shadow'
        );
        this.player1.clickCard(shadows[0]);
        expect(shadows[0].location).toBe('hand');
        expect(this.player1.actionUnavailableReason(shadows[1])).toBe('limit');
        this.player1.clickCard(this.serJorahMormont);
        expect(this.serJorahMormont.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('A Very Large Shadow with a small shadow cost', function () {
    it('reduces a cost below three to zero without gaining gold', function () {
        this.setupTest({
            phase: 'challenge',
            player1: { shadows: ['A Very Large Shadow', 'House Umber Berserkers'], gold: 0 }
        });
        this.player1.clickCard(this.aVeryLargeShadow);
        this.player1.clickCard(this.houseUmberBerserkers);
        expect(this.houseUmberBerserkers.location).toBe('play area');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});
