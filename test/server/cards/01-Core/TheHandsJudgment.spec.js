describe("The Hand's Judgment", function () {
    describe('when an event is played', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    hand: ['Hear Me Roar!', "The Hand's Judgment", 'Ser Jaime Lannister (Core)']
                },
                player2: { hand: ["The Hand's Judgment"] }
            });
            this.judgment1 = this.player1.findCardByName("The Hand's Judgment", 'hand');
            this.judgment2 = this.player2.findCardByName("The Hand's Judgment", 'hand');
            this.player1GoldBefore = this.player1Object.gold;
            this.player2GoldBefore = this.player2Object.gold;
            this.player1.clickCard(this.hearMeRoar);
            expect(this.player1).toHavePrompt('Select a character');
            this.player1.clickCard(this.serJaimeLannister);
        });

        it('cancels the event for the same cost as the event', function () {
            expect(this.player2).toAllowAbilityTrigger(this.judgment2);

            this.player2.triggerAbility(this.judgment2);
            this.player1.clickPrompt('Pass');

            expect(this.serJaimeLannister.location).not.toBe('play area');
            expect(this.player2Object.gold).toBe(this.player2GoldBefore - 1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('can itself be canceled by another Judgment at no cost', function () {
            this.player2.triggerAbility(this.judgment2);
            this.player1.triggerAbility(this.judgment1);

            expect(this.serJaimeLannister.location).toBe('play area');
            expect(this.player1Object.gold).toBe(this.player1GoldBefore - 1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('vs an event with no printed cost', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: { hand: ["The Hand's Judgment"] },
                player2: { shadows: ['Beneath the Bridge of Dream'] }
            });
            this.player2.triggerAbility(this.beneathTheBridgeOfDream);
        });

        it('can cancel it at 0 cost', function () {
            expect(this.player1).toAllowAbilityTrigger(this.theHandsJudgment);

            this.player1.triggerAbility(this.theHandsJudgment);

            expect(this.theHandsJudgment.location).toBe('discard pile');
        });
    });
});
