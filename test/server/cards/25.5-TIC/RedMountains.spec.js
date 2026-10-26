describe('Red Mountains', function () {
    function setup(context, { plot = 'Filler Plot', inPlay = [], hand = [] } = {}) {
        context.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { plot, inPlay: ['Red Mountains'] },
            player2: {
                plot: 'Trading with the Pentoshi',
                inPlay: ['Obara Sand (SoD)', 'Arianne Martell (Core)', ...inPlay],
                hand
            }
        });
    }

    describe('when triggered before challenges', function () {
        beforeEach(function () {
            setup(this, { hand: ['Edric Dayne (Core)'] });
            this.player1.clickMenu(this.redMountains, 'Force military challenge');
        });

        it('stops the opponent initiating intrigue or power challenges, or passing', function () {
            expect(this.redMountains.location).toBe('discard pile');
            expect(this.player2).toHaveDisabledPromptButton('Intrigue');
            expect(this.player2).toHaveDisabledPromptButton('Power');
            expect(this.player2).toHaveDisabledPromptButton('Done');
            expect(this.player2).isReadyToTakeAction();
        });

        describe('and the opponent no longer has characters to declare for military', function () {
            beforeEach(function () {
                this.player2.clickMenu(this.obaraSand, 'Put character into play');
                this.player2.clickCard(this.obaraSand);
                this.player2.clickCard(this.edricDayne);
            });

            it('lets them initiate intrigue or power challenges, or pass', function () {
                expect(this.player2).not.toHaveDisabledPromptButton('Intrigue');
                expect(this.player2).not.toHaveDisabledPromptButton('Power');
                expect(this.player2).not.toHaveDisabledPromptButton('Done');
                expect(this.player2).isReadyToTakeAction();
            });

            it('lets them initiate military or power, but not intrigue, after an intrigue challenge', function () {
                this.unopposedChallenge(this.player2, 'Intrigue', this.arianneMartell);
                this.player2.clickMenu(this.arianneMartell, 'Put character into play');
                this.player2.clickCard(this.obaraSand);

                expect(this.player2).not.toHaveDisabledPromptButton('Military');
                expect(this.player2).toHaveDisabledPromptButton('Intrigue');
                expect(this.player2).not.toHaveDisabledPromptButton('Power');
                expect(this.player2).not.toHaveDisabledPromptButton('Done');
                expect(this.player2).isReadyToTakeAction();
            });
        });
    });

    describe('when triggered after a military challenge', function () {
        beforeEach(function () {
            setup(this, { inPlay: ['Edric Dayne (Core)'] });
            this.unopposedChallenge(this.player2, 'Military', this.obaraSand);
            this.player1.clickMenu(this.redMountains, 'Force military challenge');
            this.player2.clickMenu(this.edricDayne, 'Give icon');
            this.player2.clickPrompt('Military');
        });

        it('lets the opponent initiate intrigue or power challenges, or pass', function () {
            expect(this.player2).not.toHaveDisabledPromptButton('Intrigue');
            expect(this.player2).not.toHaveDisabledPromptButton('Power');
            expect(this.player2).not.toHaveDisabledPromptButton('Done');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when military challenges are prevented by a plot', function () {
        beforeEach(function () {
            setup(this, { plot: 'A Game of Thrones' });
        });

        it('lets the opponent initiate intrigue or skip challenges', function () {
            this.player1.clickMenu(this.redMountains, 'Force military challenge');

            expect(this.player2).not.toHaveDisabledPromptButton('Intrigue');
            expect(this.player2).not.toHaveDisabledPromptButton('Done');
            expect(this.player2).toHaveDisabledPromptButton('Military');
            expect(this.player2).toHaveDisabledPromptButton('Power');
            expect(this.player2).isReadyToTakeAction();
        });

        it('only affects the next challenge', function () {
            this.player1.clickMenu(this.redMountains, 'Force military challenge');
            this.unopposedChallenge(this.player2, 'Intrigue', this.arianneMartell);

            expect(this.player2).not.toHaveDisabledPromptButton('Power');
            expect(this.player2).isReadyToTakeAction();
        });

        it('still has an effect if triggered after the plot condition has been fulfilled', function () {
            this.unopposedChallenge(this.player2, 'Intrigue', this.arianneMartell);
            this.player1.clickMenu(this.redMountains, 'Force military challenge');

            expect(this.player2).toHaveDisabledPromptButton('Power');
            expect(this.player2).toHaveDisabledPromptButton('Done');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});

describe('Red Mountains when the opponent cannot initiate a military challenge', function () {
    it('lets them initiate other challenges or pass', function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player1',
            player1: { faction: 'martell', inPlay: ['Red Mountains', 'Hedge Knight'] },
            player2: { plot: 'A Game of Thrones', inPlay: ['Steward at the Wall'] }
        });
        this.player1.clickCard(this.redMountains);
        this.player1.clickPrompt('Done');

        expect(this.player2).toHavePromptButton('Intrigue');
        expect(this.player2).toHavePromptButton('Done');
    });
});
