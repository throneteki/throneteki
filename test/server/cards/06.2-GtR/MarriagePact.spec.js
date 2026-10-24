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
