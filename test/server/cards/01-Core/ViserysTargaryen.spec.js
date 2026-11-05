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

describe('Viserys Targaryen (Core) under Valar Morghulis', function () {
    it('discards an attachment before the characters killed with him leave play', function () {
        this.setupTest({
            phase: 'plot',
            player1: { plotDeck: ['Valar Morghulis'], inPlay: ['Viserys Targaryen (Core)'] },
            player2: { inPlay: [{ card: 'Tumblestone Knight', attachments: ['Lady (TtB)'] }] }
        });
        this.player1.selectPlot('Valar Morghulis');
        this.player2.selectPlot('Filler Plot');
        this.selectFirstPlayer(this.player2);

        expect(this.tumblestoneKnight.location).toBe('play area');

        this.player1.triggerAbility(this.viserysTargaryen);
        this.player1.clickCard(this.lady);

        expect(this.lady.location).toBe('discard pile');
        expect(this.tumblestoneKnight.location).toBe('dead pile');
        expect(this.viserysTargaryen.location).toBe('dead pile');
    });
});
