describe('Magnar of Thenn', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [{ card: 'Sigorn', attachments: ['Magnar of Thenn'] }, 'Wildling Scout']
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.sigorn);
        this.player1.triggerAbility(this.magnarOfThenn);
        this.player1.clickCard(this.wildlingScout);
    });

    it('gives the attached character the Lord trait and pillage, and sacrifices another Wildling to save it', function () {
        expect(this.sigorn.hasTrait('Lord')).toBe(true);
        expect(this.sigorn.hasKeyword('pillage')).toBe(true);
        expect(this.wildlingScout.location).toBe('discard pile');
        expect(this.sigorn.location).toBe('play area');
        expect(this.player2).isReadyToTakeAction();
    });
});
