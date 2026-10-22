describe('Growing Influence', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'tyrell', hand: ['Growing Influence'], gold: 1 },
            player2: {
                inPlay: ['Magister Illyrio (Core)', { card: 'Tumblestone Knight', kneeling: true }],
                gold: 2
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.magisterIllyrio);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.growingInfluence);
    });

    it('gives an opponent 1 gold to cancel the effects of their triggered character or location ability', function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});
