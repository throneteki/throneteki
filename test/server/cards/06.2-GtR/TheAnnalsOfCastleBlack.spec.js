describe('The Annals of Castle Black (GtR)', function () {
    function setup({ hand = [], discard = [] }) {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['The Annals of Castle Black (GtR)', 'A Noble Cause'],
                hand,
                discard
            },
            player2: { plotDeck: ['A Noble Cause', 'Filler Plot'] }
        });
        this.player1.selectPlot('The Annals of Castle Black');
        this.player2.selectPlot('A Noble Cause');
    }

    describe('when playing an event from hand', function () {
        beforeEach(function () {
            setup.call(this, { hand: ['Hear Me Roar!', 'Lannisport Merchant'] });
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.hearMeRoar);
            this.player1.clickCard(this.lannisportMerchant);
        });

        it('resolves the event and removes it from the game', function () {
            expect(this.lannisportMerchant.location).toBe('play area');
            expect(this.hearMeRoar.location).toBe('out of game');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when playing an event from the discard pile', function () {
        beforeEach(function () {
            setup.call(this, { hand: ['Lannisport Merchant'], discard: ['Hear Me Roar!'] });
            this.selectFirstPlayer(this.player1);
            this.player1.clickCard(this.hearMeRoar);
            expect(this.player1).toHavePrompt('Select a character');
            this.player1.clickCard(this.lannisportMerchant);
        });

        it('resolves the event and removes it from the game', function () {
            expect(this.lannisportMerchant.location).toBe('play area');
            expect(this.hearMeRoar.location).toBe('out of game');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an interrupt event is in the discard pile', function () {
        beforeEach(function () {
            setup.call(this, { discard: ['Ahead of the Tide'] });
        });

        it('lets the event be played', function () {
            expect(this.player1).toAllowAbilityTrigger('Ahead of the Tide');
        });

        it('removes the event from the game if played', function () {
            this.player1.triggerAbility('Ahead of the Tide');

            expect(this.aheadOfTheTide.location).toBe('out of game');
        });

        it('stops letting it be played once Annals is no longer the revealed plot', function () {
            this.player1.clickPrompt('Pass');
            this.selectFirstPlayer(this.player1);
            this.completeMarshalPhase();
            this.completeChallengesPhase();
            this.player1.selectPlot('A Noble Cause');
            this.player2.selectPlot('Filler Plot');

            expect(this.player1).not.toAllowAbilityTrigger('Ahead of the Tide');
        });
    });

    describe('when an event is discarded at random from hand', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: { plot: 'The Annals of Castle Black (GtR)', hand: ['Hear Me Roar!'] },
                player2: { inPlay: ['Maester Luwin'] }
            });
            this.unopposedChallenge(this.player2, 'Intrigue', this.maesterLuwin);
        });

        it('removes the event from the game', function () {
            expect(this.hearMeRoar.location).toBe('out of game');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when an event is discarded through pillage', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: { plot: 'The Annals of Castle Black (GtR)', inPlay: ['Wildling Horde'] },
                player2: { drawDeck: ['Hear Me Roar!'] }
            });
            this.unopposedChallenge(this.player1, 'Power', this.wildlingHorde);
        });

        it('removes the event from the game', function () {
            expect(this.hearMeRoar.location).toBe('out of game');
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
