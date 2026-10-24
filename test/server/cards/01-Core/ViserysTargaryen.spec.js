describe('Viserys Targaryen (Core)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: ['Viserys Targaryen (Core)'] },
            player2: { inPlay: [{ card: 'Tumblestone Knight', attachments: ['Lady (TtB)'] }] }
        });
        this.unopposedChallenge(this.player2, 'Military', this.tumblestoneKnight);
        this.player1.clickCard(this.viserysTargaryen);
    });

    it('discards an attachment from play when he leaves play', function () {
        this.player1.triggerAbility(this.viserysTargaryen);
        this.player1.clickCard(this.lady);

        expect(this.lady.location).toBe('discard pile');
        expect(this.viserysTargaryen.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
