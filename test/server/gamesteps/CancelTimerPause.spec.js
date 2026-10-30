describe('pausing the cancel timer for the round', function () {
    function setup(context, player2Hand) {
        context.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'lannister',
                hand: [
                    'Hear Me Roar!',
                    'Hear Me Roar!',
                    'Lannisport Merchant',
                    'Ser Jaime Lannister (Core)'
                ]
            },
            player2: { faction: 'lannister', gold: 5, hand: player2Hand }
        });

        // The harness turns the cancel timer off for every player.
        context.player2.player.noTimer = false;

        [context.firstRoar, context.secondRoar] = context.player1.filterCardsByName(
            'Hear Me Roar!',
            'hand'
        );
    }

    function playRoar(context, roar, character) {
        context.player1.clickCard(roar);
        context.player1.clickCard(character);
    }

    describe('when the opponent holds a cancel', function () {
        beforeEach(function () {
            setup(this, ["The Hand's Judgment"]);
            playRoar(this, this.firstRoar, this.lannisportMerchant);
        });

        it('offers the cancel window with the timer', function () {
            expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
            expect(this.player2).toHavePromptButton("Don't ask again until end of round");
        });

        describe('and they pause the timer', function () {
            beforeEach(function () {
                this.player2.clickPrompt("Don't ask again until end of round");
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('does not offer the window again this round, even with a legal cancel', function () {
                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.serJaimeLannister.location).toBe('play area');
                expect(this.theHandsJudgment.location).toBe('hand');
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('and they pass without pausing', function () {
            beforeEach(function () {
                this.player2.clickPrompt('Pass');
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('offers the window again', function () {
                expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
            });
        });
    });

    describe('when the opponent holds no cancel', function () {
        beforeEach(function () {
            setup(this, []);
            playRoar(this, this.firstRoar, this.lannisportMerchant);
        });

        it('offers the window with the timer all the same', function () {
            expect(this.player2).toHavePromptButton("Don't ask again until end of round");
        });

        describe('and they pause the timer', function () {
            beforeEach(function () {
                this.player2.clickPrompt("Don't ask again until end of round");
                playRoar(this, this.secondRoar, this.serJaimeLannister);
            });

            it('behaves exactly as it does for a player holding a cancel', function () {
                expect(this.serJaimeLannister.location).toBe('play area');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });
});
