describe('Marriage Pact', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { inPlay: ['Tumblestone Knight'], hand: ['Marriage Pact'] },
            player2: { inPlay: ['Castle Guard', 'Hedge Knight', 'Winterfell Steward'] }
        });
        this.player1.clickCard(this.marriagePact);
        this.player1.clickCard(this.castleGuard);
        this.completeMarshalPhase();
    });

    it('stops the attached character attacking you', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');

        expect(this.player2).not.toBeAbleToSelect(this.castleGuard);
        expect(this.player2).toBeAbleToSelect(this.hedgeKnight);

        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.player2).isReadyToTakeAction();
    });

    it('stops the attached character defending against you', function () {
        this.player1.clickPrompt('Power');
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player2).not.toBeAbleToSelect(this.castleGuard);
        expect(this.player2).toBeAbleToSelect(this.winterfellSteward);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });

    it('makes you sacrifice a character when the attached character leaves play', function () {
        this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
        this.player2.clickCard(this.castleGuard);

        expect(this.player1).toHavePrompt('Select a character');
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.castleGuard.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('discard pile');
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Marriage Pact on your own character', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                inPlay: ['Tumblestone Knight', 'Winterfell Steward'],
                hand: ['Marriage Pact']
            },
            player2: { inPlay: ['Castle Guard'] }
        });
        this.player1.clickCard(this.marriagePact);
        this.player1.clickCard(this.tumblestoneKnight);
        this.completeMarshalPhase();
    });

    it('lets the attached character attack for you', function () {
        this.player1.clickPrompt('Power');

        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player1).toBeAbleToSelect(this.winterfellSteward);

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.game.currentChallenge.isAttacking(this.tumblestoneKnight)).toBe(true);

        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).isReadyToTakeAction();
    });

    it('lets the attached character defend for you', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        expect(this.player1).toBeAbleToSelect(this.winterfellSteward);

        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.clickPrompt('Done');

        expect(this.game.currentChallenge.isDefending(this.tumblestoneKnight)).toBe(true);

        this.skipActionWindow();

        expect(this.player2).isReadyToTakeAction();
    });
});

describe('Marriage Pact under Valar Morghulis', function () {
    it('lets you sacrifice a character that is also being killed', function () {
        this.setupTest({
            phase: 'plot',
            player1: {
                plotDeck: ['Valar Morghulis'],
                inPlay: [
                    {
                        card: 'Tumblestone Knight',
                        attachments: [{ card: 'Marriage Pact', owner: 'player2' }]
                    }
                ]
            },
            player2: { inPlay: ['Castle Guard', 'Hedge Knight'] }
        });
        this.player1.selectPlot('Valar Morghulis');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player1);

        expect(this.player2).toBeAbleToSelect(this.castleGuard);

        this.player2.clickCard(this.castleGuard);

        expect(this.castleGuard.location).toBe('discard pile');
        expect(this.hedgeKnight.location).toBe('dead pile');
        expect(this.tumblestoneKnight.location).toBe('dead pile');
    });
});
