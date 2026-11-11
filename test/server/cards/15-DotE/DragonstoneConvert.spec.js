describe('Dragonstone Convert', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Dragonstone Convert', 'House Maester'],
                hand: ["The Dragon's Tail (AtSK)", 'Tithe']
            },
            player2: { hand: ["The Dragon's Tail (AtSK)"] }
        });
        this.tail1 = this.player1.findCardByName("The Dragon's Tail", 'hand');
        this.tail2 = this.player2.findCardByName("The Dragon's Tail", 'hand');
    });

    function nameTail(context) {
        context.player1.clickCard(context.dragonstoneConvert);
        context.player1.nameCard("The Dragon's Tail");
    }

    it('prevents both players playing the named event and leaves other events playable', function () {
        nameTail(this);
        expect(this.player1Object.canPlay(this.tail1)).toBe(false);
        expect(this.player2Object.canPlay(this.tail2)).toBe(false);
        this.player1.clickCard(this.tail1);
        expect(this.tail1.location).toBe('hand');
        this.player1.clickCard(this.tithe);
        this.player1.clickCard(this.houseMaester);
        expect(this.tithe.location).toBe('discard pile');
        expect(this.houseMaester.kneeled).toBe(true);
        expect(this.tail2.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('matches event titles regardless of the capitalization used when naming', function () {
        this.player1.clickCard(this.dragonstoneConvert);
        this.player1.nameCard("the dragon's tail");
        expect(this.player1Object.canPlay(this.tail1)).toBe(false);
        expect(this.player2Object.canPlay(this.tail2)).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('prevents the opponent actually playing the named event on their challenge turn', function () {
        nameTail(this);
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.tail2);
        expect(this.tail2.location).toBe('hand');
        expect(this.tail1.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });

    it('rejects non-events and unknown names before accepting a valid event', function () {
        this.player1.clickCard(this.dragonstoneConvert);
        for (const name of ['House Maester', 'Not a real card']) {
            this.player1.nameCard(name);
            expect(this.player1).toHavePrompt('Name an event');
            expect(this.player1Object.canPlay(this.tail1)).toBe(true);
            expect(this.player2Object.canPlay(this.tail2)).toBe(true);
        }
        this.player1.nameCard("The Dragon's Tail");
        expect(this.player1Object.canPlay(this.tail1)).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be used a second time in the phase', function () {
        nameTail(this);
        expect(this.player1.actionUnavailableReason(this.dragonstoneConvert)).toBe('limit');
        expect(this.player1Object.canPlay(this.tithe)).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('allows the named event again after the challenges phase ends', function () {
        nameTail(this);
        this.player1.togglePromptedActionWindow('dominance', true);
        this.completeChallengesPhase();
        expect(this.player1Object.canPlay(this.tail1)).toBe(true);
        expect(this.player2Object.canPlay(this.tail2)).toBe(true);
        expect(this.player1.actionUnavailableReason(this.dragonstoneConvert)).toBe('phase');
        this.player1.clickCard(this.tail1);
        expect(this.tail1.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});

describe('Dragonstone Convert outside challenges', function () {
    it('cannot use its naming action during marshaling', function () {
        this.setupTest({ phase: 'marshal', player1: { inPlay: ['Dragonstone Convert'] } });
        expect(this.player1.actionUnavailableReason(this.dragonstoneConvert)).toBe('phase');
        expect(this.player1).isReadyToTakeAction();
    });
});
