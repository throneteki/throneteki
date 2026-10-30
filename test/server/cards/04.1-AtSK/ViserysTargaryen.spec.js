describe('Viserys Targaryen (AtSK)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Viserys Targaryen (AtSK)'] },
            player2: { inPlay: ['Robert Baratheon (Core)'] }
        });
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.viserysTargaryen);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
    });

    it('makes each King character defend while he is attacking', function () {
        expect(this.robertBaratheon.isDefending()).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Viserys Targaryen (AtSK)', function () {
    beforeEach(function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Viserys Targaryen (AtSK)'] } });
        this.player1.togglePromptedActionWindow('standing', true);
        this.completeChallengesPhase();
        this.player1.triggerAbility(this.viserysTargaryen);
    });

    it('gains 1 power when the dominance phase ends if no opponent controls a King', function () {
        expect(this.viserysTargaryen.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
