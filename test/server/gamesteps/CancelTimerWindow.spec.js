describe('cancel windows for a player with the timer', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', hand: ['Hear Me Roar!', 'Lannisport Merchant'] },
            player2: { faction: 'stark', gold: 5, hand: ["The Hand's Judgment"] }
        });

        const player2 = this.player2.player;
        player2.noTimer = false;
        player2.user.settings.windowTimer = 5;
        player2.timerSettings = { events: true, abilities: false };

        this.scheduled = [];
        this.game.schedule = (delay, callback) => this.scheduled.push({ delay, callback });

        this.player1.clickCard(this.hearMeRoar);
        this.player1.clickCard(this.lannisportMerchant);
    });

    function delayControl(context) {
        return context.player2.player.promptState.controls.find(
            (control) => control.type === 'response-delay'
        );
    }

    it('shows the window with their timer', function () {
        expect(this.player2).toHavePrompt('Any interrupts to the effects of Hear Me Roar!?');
        expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
        expect(this.player2).toHavePromptButton('I need more time');
        expect(delayControl(this)).toEqual(
            expect.objectContaining({ duration: 5000, abilityWord: 'interrupt' })
        );
        expect(this.scheduled.map((item) => item.delay)).toEqual([5000]);
    });

    it('passes for them when the timer runs out', function () {
        this.scheduled[0].callback();

        expect(this.lannisportMerchant.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    describe('when they ask for more time', function () {
        beforeEach(function () {
            this.player2.clickPrompt('I need more time');
        });

        it('stops the timer and leaves the window open', function () {
            this.scheduled[0].callback();

            expect(this.player2).toHavePrompt('Any interrupts to the effects of Hear Me Roar!?');
            expect(this.player2).not.toHavePromptButton('I need more time');
            expect(delayControl(this)).toBeUndefined();
            expect(this.lannisportMerchant.location).toBe('hand');
        });

        it('waits for them to pass', function () {
            this.player2.clickPrompt('Pass');

            expect(this.lannisportMerchant.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    it('stops asking for the rest of the round', function () {
        this.player2.clickPrompt("Don't ask again until end of round");

        expect(this.lannisportMerchant.location).toBe('play area');
        expect(this.player2.player.timerPausedForRound).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });
});
