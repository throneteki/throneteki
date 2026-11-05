describe('Cersei Lannister (LoCR)', function () {
    describe('when she attacks in an [intrigue] challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    inPlay: ['Cersei Lannister (LoCR)']
                },
                player2: {
                    hand: ['Hedge Knight']
                }
            });

            this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
        });

        it('does not kneel', function () {
            expect(this.cerseiLannister.kneeled).toBe(false);
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).toAllowAbilityTrigger(this.cerseiLannister);

            this.player1.clickPrompt('Pass');

            expect(this.player1).isReadyToTakeAction();
        });

        it('gains 1 power after a card is discarded from an opponent’s hand', function () {
            this.player1.triggerAbility(this.cerseiLannister);

            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.cerseiLannister.power).toBe(1);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Cersei Lannister to have Cersei Lannister gain 1 power'
            );
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when she attacks in a [power] challenge', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    inPlay: ['Cersei Lannister (LoCR)']
                }
            });

            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.cerseiLannister);
            this.player1.clickPrompt('Done');
        });

        it('kneels', function () {
            expect(this.cerseiLannister.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when several cards are discarded from an opponent’s hand at once', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    plot: 'Sneak Attack',
                    inPlay: ['Cersei Lannister (LoCR)']
                },
                player2: {
                    hand: ['Hedge Knight', 'House Dayne Knight']
                }
            });

            this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
            this.player2.clickPrompt('Done');
        });

        it('gains only 1 power', function () {
            this.player1.triggerAbility(this.cerseiLannister);

            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.houseDayneKnight.location).toBe('discard pile');
            expect(this.cerseiLannister.power).toBe(1);
            expect(this.player1).not.toAllowAbilityTrigger(this.cerseiLannister);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a card is discarded from an opponent’s hand by another effect', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'plot',
                player1: {
                    faction: 'lannister',
                    plotDeck: ['Heads on Spikes'],
                    inPlay: ['Cersei Lannister (LoCR)']
                },
                player2: {
                    hand: ['Hedge Knight']
                }
            });

            this.player1.selectPlot(this.headsOnSpikes);
            this.player2.selectPlot('Filler Plot');
            this.selectFirstPlayer(this.player1);
        });

        it('gains 1 power', function () {
            this.player1.triggerAbility(this.cerseiLannister);

            expect(this.hedgeKnight.location).toBe('dead pile');
            expect(this.cerseiLannister.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a card discarded from an opponent’s hand is put into play instead', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    inPlay: ['Cersei Lannister (LoCR)']
                },
                player2: {
                    hand: ['Missandei']
                }
            });

            this.unopposedChallenge(this.player1, 'Intrigue', this.cerseiLannister);
            this.player2.triggerAbility(this.missandei);
        });

        it('still gains 1 power', function () {
            expect(this.missandei.location).toBe('play area');

            this.player1.triggerAbility(this.cerseiLannister);

            expect(this.cerseiLannister.power).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a card is discarded from your own hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'lannister',
                    hand: ['Hedge Knight'],
                    inPlay: ['Cersei Lannister (LoCR)']
                },
                player2: {
                    inPlay: ['House Maester']
                }
            });

            this.player1.clickPrompt('Done');
            this.unopposedChallenge(this.player2, 'Intrigue', this.houseMaester);
        });

        it('cannot be triggered', function () {
            expect(this.hedgeKnight.location).toBe('discard pile');
            expect(this.player1).not.toAllowAbilityTrigger(this.cerseiLannister);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
