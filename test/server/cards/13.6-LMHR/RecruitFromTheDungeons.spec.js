describe('Recruit from the Dungeons', function () {
    function defend(context, attacker = 'Ranging Party', kneeling = false) {
        context.setupTest({
            phase: 'challenge',
            player1: { inPlay: [{ card: 'Recruit from the Dungeons', kneeling }, 'House Maester'] },
            player2: { inPlay: [attacker] }
        });
        context.player1.clickPrompt('Done');
        context.player2.clickPrompt(attacker === 'Winterfell Steward' ? 'Power' : 'Military');
        context.player2.clickCard(context.player2.findCardByName(attacker, 'play area'));
        context.player2.clickPrompt('Done');
        context.skipActionWindow();
        context.player1.clickPrompt('Done');
    }

    it('joins as a defender without a matching icon and returns to shadows after losing', function () {
        defend(this);
        this.player1.clickCard(this.recruitFromTheDungeons);
        expect(this.recruitFromTheDungeons.kneeled).toBe(true);
        expect(this.recruitFromTheDungeons.isDefending()).toBe(true);
        expect(this.houseMaester.isDefending()).toBe(false);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.recruitFromTheDungeons.location).toBe('shadows');
        this.player1.clickCard(this.houseMaester);
        expect(this.houseMaester.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('remains in play when its side wins the challenge', function () {
        defend(this, 'Winterfell Steward');
        this.player1.clickCard(this.recruitFromTheDungeons);
        this.player2.clickPrompt('Pass');
        this.player1.clickPrompt('Pass');
        expect(this.recruitFromTheDungeons.location).toBe('play area');
        expect(this.recruitFromTheDungeons.kneeled).toBe(true);
        expect(this.houseMaester.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot pay the kneeling cost when already kneeling', function () {
        defend(this, 'Ranging Party', true);
        expect(this.player1.actionUnavailableReason(this.recruitFromTheDungeons)).toBe('cost');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot use the action outside a challenge', function () {
        this.setupTest({ phase: 'challenge', player1: { inPlay: ['Recruit from the Dungeons'] } });
        expect(this.player1.actionUnavailableReason(this.recruitFromTheDungeons)).toBe('condition');
        expect(this.player1).isReadyToTakeAction();
    });
});
