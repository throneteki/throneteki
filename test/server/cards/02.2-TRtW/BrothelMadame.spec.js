describe('Brothel Madame', function () {
    function setup(context, player1 = {}) {
        context.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['Brothel Madame'], gold: 5, ...player1 },
            player2: { faction: 'lannister', inPlay: ['Hedge Knight'], gold: 5 }
        });
    }

    describe('when the opponent does not pay', function () {
        beforeEach(function () {
            setup(this);
            this.completeMarshalPhase();
            this.player1.triggerAbility('Brothel Madame');
            this.player2.clickPrompt('No');
            this.player1.clickPrompt('Done');
        });

        it('stops them initiating military challenges against you this phase', function () {
            expect(this.player2).toHaveDisabledPromptButton('Military');
        });
    });

    describe('when the opponent pays', function () {
        beforeEach(function () {
            setup(this);
            this.completeMarshalPhase();
            this.goldBefore = [this.player1Object.gold, this.player2Object.gold];
            this.player1.triggerAbility('Brothel Madame');
            this.player2.clickPrompt('Yes');
            this.player1.clickPrompt('Done');
        });

        it('gives you their gold', function () {
            expect(this.player1Object.gold).toBe(this.goldBefore[0] + 1);
            expect(this.player2Object.gold).toBe(this.goldBefore[1] - 1);
        });

        it('lets them initiate military challenges', function () {
            this.player2.clickPrompt('Military');
            expect(this.player2).toHavePrompt('Select challenge attackers');
        });
    });

    it('lets the opponent initiate military challenges after giving you gold some other way', function () {
        setup(this, { hand: ['Paid Off'], gold: 6 });
        this.player1.clickCard(this.paidOff);
        this.player1.clickCard(this.hedgeKnight);
        this.completeMarshalPhase();
        this.player1.triggerAbility('Brothel Madame');
        this.player2.clickPrompt('No');
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.brothelMadame);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.triggerAbility('Paid Off');
        this.player2.clickPrompt('Yes');
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        expect(this.player2).toHavePrompt('Select challenge attackers');
    });

    describe('when there are two Brothel Madames', function () {
        beforeEach(function () {
            setup(this, { inPlay: ['Brothel Madame', 'Brothel Madame'] });
            this.completeMarshalPhase();
        });

        it('does not offer the second once the opponent has paid', function () {
            this.player1.triggerAbility('Brothel Madame');
            this.player2.clickPrompt('Yes');
            expect(this.player1).not.toAllowAbilityTrigger('Brothel Madame');
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            expect(this.player2).toHavePrompt('Select challenge attackers');
        });

        it('lets the opponent pay for the second after declining the first', function () {
            this.player1.triggerAbility('Brothel Madame');
            this.player2.clickPrompt('No');
            this.player1.triggerAbility('Brothel Madame');
            this.player2.clickPrompt('Yes');
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            expect(this.player2).toHavePrompt('Select challenge attackers');
        });
    });
});
