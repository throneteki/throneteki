describe('War Scorpion (TSoW)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Knights of the Vale (AHaH)', 'Tumblestone Knight'],
                hand: ['The Eyrie (CoW)']
            },
            player2: { inPlay: [{ card: 'Scorpion Knight', attachments: ['War Scorpion (TSoW)'] }] }
        });
    });

    it('gives the attached character +2 STR', function () {
        expect(this.scorpionKnight.getStrength()).toBe(4);
        expect(this.player1).isReadyToTakeAction();
    });

    it('is sacrificed to remove an attacking character from the challenge', function () {
        this.completeMarshalPhase();
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        this.player2.clickMenu(this.warScorpion, 'Remove attacker from challenge');
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.isAttacking()).toBe(false);
        expect(this.warScorpion.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('can kill an attacking Army character instead', function () {
        this.completeMarshalPhase();
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.knightsOfTheVale);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        this.player2.clickMenu(this.warScorpion, 'Remove attacker from challenge');
        this.player2.clickCard(this.knightsOfTheVale);
        this.player2.clickPrompt('Kill');

        expect(this.knightsOfTheVale.location).toBe('dead pile');
        expect(this.player1).isReadyToTakeAction();
    });

    it('does not offer to kill an Army character that cannot be killed', function () {
        this.player1.clickCard(this.theEyrie);
        this.completeMarshalPhase();
        this.player1.triggerAbility(this.theEyrie);
        this.player1.clickCard(this.knightsOfTheVale);
        this.player1.clickPrompt('Military');
        this.player1.clickCard(this.knightsOfTheVale);
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Done');
        this.player1.clickPrompt('Pass');
        this.player2.clickMenu(this.warScorpion, 'Remove attacker from challenge');
        this.player2.clickCard(this.knightsOfTheVale);

        expect(this.player2).toHaveDisabledPromptButton('Kill');
        this.player2.clickPrompt('Remove from challenge');

        expect(this.knightsOfTheVale.isAttacking()).toBe(false);
        expect(this.player1).isReadyToTakeAction();
    });
});
