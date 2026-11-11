describe('Long May He Reign', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Tommen Baratheon (LoCR)', attachments: ['Long May He Reign'] },
                    'Tumblestone Knight'
                ]
            },
            player2: { inPlay: ['Castle Guard'] }
        });
    });

    it('stops the attached character being killed', function () {
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.castleGuard);
        expect(this.player1).not.toBeAbleToSelect(this.tommenBaratheon);
        expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
        this.player1.clickCard(this.tumblestoneKnight);
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('is sacrificed after you lose a power challenge as the defending player', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.castleGuard);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        expect(this.longMayHeReign.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
