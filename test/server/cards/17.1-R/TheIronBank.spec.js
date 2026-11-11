describe('The Iron Bank (R)', function () {
    function setup(context, options = {}) {
        context.setupTest({
            phase: options.phase || 'marshal',
            firstPlayer: options.firstPlayer || 'player1',
            player1: {
                inPlay: [
                    { card: 'The Iron Bank (R)', gold: options.bankGold ?? 10 },
                    ...(options.inPlay || [])
                ],
                hand: options.hand || [],
                gold: options.gold ?? (options.phase === 'plot' ? 0 : 5),
                plot: options.plot
            },
            player2: options.player2 || {}
        });
    }

    for (const amount of [1, 4, 5, 6, 10]) {
        it(`adds the correct interest when it holds ${amount} gold`, function () {
            setup(this, { phase: 'plot', bankGold: amount });
            this.player1.selectPlot('Filler Plot');
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
            expect(this.player1).toAllowAbilityTrigger('The Iron Bank');
            this.player1.triggerAbility('The Iron Bank');
            expect(this.theIronBank.gold).toBe(amount + Math.min(amount, 5));
            expect(this.player1Object.gold).toBe(5);
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('does not offer interest without gold on the bank', function () {
        setup(this, { phase: 'plot', bankGold: 0 });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        expect(this.player1).not.toAllowAbilityTrigger('The Iron Bank');
        expect(this.theIronBank.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not treat bank gold as gold that an opponent can steal', function () {
        setup(this, { phase: 'plot', player2: { hand: ['A Meager Contribution'], gold: 0 } });
        this.player1.selectPlot('Filler Plot');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);
        this.player1.clickPrompt('Pass');
        this.player2.triggerAbility('A Meager Contribution');
        this.player1.clickPrompt('Pass');
        expect(this.theIronBank.gold).toBe(10);
        expect(this.player1Object.gold).toBe(4);
        expect(this.player2Object.gold).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });

    it('can split a marshaling payment between the bank and your gold pool', function () {
        setup(this, { hand: ['Cersei Lannister (LoCR)'], plot: 'A Noble Cause' });
        this.player1.clickCard(this.cerseiLannister);
        this.player1.clickPrompt('2');
        expect(this.cerseiLannister.location).toBe('play area');
        expect(this.theIronBank.gold).toBe(8);
        expect(this.player1Object.gold).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('can pay for an event with bank gold while leaving the gold pool untouched', function () {
        setup(this, { hand: ['Nightmares'], player2: { inPlay: ['House Maester'] } });
        this.player1.clickCard(this.nightmares);
        this.player1.clickPrompt('1');
        this.player1.clickCard(this.houseMaester);
        expect(this.houseMaester.isAnyBlank()).toBe(true);
        expect(this.theIronBank.gold).toBe(9);
        expect(this.player1Object.gold).toBe(5);
        expect(this.player1).isReadyToTakeAction();
    });

    for (const gold of [3, 5]) {
        it(`can pay bestow from the bank after marshaling with ${gold} pool gold`, function () {
            setup(this, { gold, hand: ['Stone Crows'] });
            this.player1.clickCard(this.stoneCrows);
            this.player1.clickPrompt('0');
            this.player1.clickPrompt('2');
            if (gold === 5) this.player1.clickPrompt('2');
            expect(this.stoneCrows.gold).toBe(2);
            expect(this.theIronBank.gold).toBe(8);
            expect(this.player1Object.gold).toBe(gold - 3);
            expect(this.player1).isReadyToTakeAction();
        });
    }

    it('can move bank gold to a card as if it came from your gold pool', function () {
        setup(this, { hand: ['Red Cloaks'] });
        this.player1.clickCard(this.redCloaks);
        this.player1.clickPrompt('0');
        this.player1.clickMenu(this.redCloaks, 'Move 1 gold from your gold pool to this card');
        this.player1.clickPrompt('1');
        expect(this.redCloaks.gold).toBe(1);
        expect(this.theIronBank.gold).toBe(9);
        expect(this.player1Object.gold).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('automatically pays ability costs from the bank when the gold pool is empty', function () {
        setup(this, { hand: ['Janos Slynt (AtSK)'] });
        this.player1.clickCard(this.janosSlynt);
        this.player1.clickPrompt('0');
        this.player1.clickMenu(this.janosSlynt, 'Pay 1 gold to give Janos Slynt +2 strength');
        expect(this.janosSlynt.getStrength()).toBe(4);
        expect(this.theIronBank.gold).toBe(9);
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    it('pays event costs during the opponents marshaling turn with an empty gold pool', function () {
        setup(this, {
            firstPlayer: 'player2',
            gold: 0,
            hand: ['Nightmares'],
            player2: { inPlay: ['House Maester'], hand: ['Hedge Knight'], gold: 2 }
        });
        this.player1.togglePromptedActionWindow('marshal', true);
        this.player2.clickCard(this.hedgeKnight);
        this.player1.clickCard(this.nightmares);
        this.player1.clickCard(this.houseMaester);
        expect(this.houseMaester.isAnyBlank()).toBe(true);
        expect(this.theIronBank.gold).toBe(9);
        expect(this.player1Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('pays interrupt costs from the bank during the opponents marshaling turn', function () {
        setup(this, {
            firstPlayer: 'player2',
            gold: 0,
            hand: ["The Hand's Judgment"],
            inPlay: ['House Maester'],
            player2: { hand: ['Nightmares'], gold: 5 }
        });
        this.player2.clickCard(this.nightmares);
        this.player2.clickCard(this.houseMaester);
        expect(this.player1).toAllowAbilityTrigger("The Hand's Judgment");
        this.player1.triggerAbility("The Hand's Judgment");
        expect(this.houseMaester.isAnyBlank()).toBe(false);
        expect(this.theIronBank.gold).toBe(9);
        expect(this.player1Object.gold).toBe(0);
        expect(this.player2).isReadyToTakeAction();
    });

    it('does not let an opponent spend gold from your bank', function () {
        setup(this, { firstPlayer: 'player2', player2: { hand: ['Nightmares'], gold: 0 } });
        expect(this.player2.actionUnavailableReason(this.nightmares)).toBe('cost');
        expect(this.theIronBank.gold).toBe(10);
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot spend bank gold outside the marshaling phase', function () {
        setup(this, { phase: 'challenge', gold: 0, hand: ['Nightmares'] });
        expect(this.player1.actionUnavailableReason(this.nightmares)).toBe('cost');
        expect(this.theIronBank.gold).toBe(10);
        expect(this.player1).isReadyToTakeAction();
    });
});
