describe('Caggo Corpsekiller', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Caggo Corpsekiller', { card: 'Hedge Knight', attachments: ['Patience'] }]
            }
        });
        this.player1.clickMenu(this.patience, 'Return parent to hand');
        this.player1.triggerAbility('Caggo Corpsekiller');
    });

    it("returns itself to hand to place a character being returned to hand in its owner's dead pile instead", function () {
        expect(this.caggoCorpsekiller.location).toBe('hand');
        expect(this.hedgeKnight.location).toBe('dead pile');
    });

    it('names the hand in the game log', function () {
        expect(this.game.getPlainTextLog()).toContain(
            "player1 returns Caggo Corpsekiller to place Hedge Knight in its owner's dead pile instead of their hand"
        );
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Caggo Corpsekiller when an opponent places a character in shadows', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['House Maester'],
                shadows: ['Banished from the Light']
            },
            player2: { inPlay: ['Caggo Corpsekiller', 'Doreah'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.houseMaester);
        this.player1.triggerAbility('Banished from the Light');
        this.player1.clickCard(this.doreah);
        this.player2.triggerAbility('Caggo Corpsekiller');
    });

    it("places that character in its owner's dead pile instead of the shadow area", function () {
        expect(this.caggoCorpsekiller.location).toBe('hand');
        expect(this.doreah.location).toBe('dead pile');
        expect(this.houseMaester.location).toBe('play area');
        expect(this.game.getPlainTextLog()).toContain(
            "player2 returns Caggo Corpsekiller to place Doreah in its owner's dead pile instead of their shadow area"
        );
        expect(this.player1).isReadyToTakeAction();
    });
});
