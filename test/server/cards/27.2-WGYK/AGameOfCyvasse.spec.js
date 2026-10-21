describe('A Game of Cyvasse', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                gold: 1,
                hand: ['A Game of Cyvasse'],
                inPlay: ['House Dayne Knight', 'Silent Sisters', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Shadow City Septon', 'Starry Septa']
            }
        });

        this.player1.clickCard(this.aGameOfCyvasse);
    });

    it('is played', function () {
        expect(this.aGameOfCyvasse.location).toBe('discard pile');
        expect(this.player1Object.gold).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });

    describe('in the next intrigue challenge you initiate', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard(this.silentSisters);
        });

        it('stops you declaring more than 1 attacker', function () {
            expect(this.player1).toHavePrompt('Select challenge attackers (max 1)');

            this.player1.clickCard(this.houseDayneKnight);
            this.player1.clickPrompt('Done');

            expect(this.game.currentChallenge.attackers).toHaveLength(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('stops the defender declaring more than 1 defender', function () {
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
            this.player2.clickCard(this.shadowCitySepton);
            this.player2.clickCard(this.starrySepta);
            this.player2.clickPrompt('Done');

            expect(this.game.currentChallenge.defenders).toHaveLength(1);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('when you win it', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
            });

            it('lets you initiate an additional intrigue challenge', function () {
                expect(this.player1).toHavePromptButton('Intrigue');
                expect(this.player1).isReadyToTakeAction();
            });

            it('does not restrict that additional challenge', function () {
                this.player1.clickPrompt('Intrigue');

                expect(this.player1).toHavePrompt('Select challenge attackers');

                this.player1.clickCard(this.houseDayneKnight);
                this.player1.clickPrompt('Done');

                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when you lose it', function () {
            beforeEach(function () {
                this.player1.clickPrompt('Done');
                this.skipActionWindow();
                this.player2.clickCard(this.shadowCitySepton);
                this.player2.clickPrompt('Done');
                this.skipActionWindow();
            });

            it('does not let you initiate an additional intrigue challenge', function () {
                expect(this.player1).toHaveDisabledPromptButton('Intrigue');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('in a challenge of another type', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
        });

        it('does not restrict attackers', function () {
            expect(this.player1).toHavePrompt('Select challenge attackers');

            this.player1.clickCard(this.houseDayneKnight);
            this.player1.clickPrompt('Done');

            expect(this.player1).isReadyToTakeAction();
        });
    });
});
