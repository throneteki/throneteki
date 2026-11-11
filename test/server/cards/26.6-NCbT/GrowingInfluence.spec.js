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

describe("Growing Influence when an opponent uses your character's ability", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'tyrell',
                hand: ['Growing Influence'],
                inPlay: ['Bronn (CoW)'],
                gold: 1
            },
            player2: { gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.bronn);
    });

    it('gives the player who used it 1 gold to cancel it', function () {
        const player1Gold = this.player1Object.gold;
        const player2Gold = this.player2Object.gold;
        expect(this.player1).toAllowAbilityTrigger(this.growingInfluence);

        this.player1.triggerAbility(this.growingInfluence);

        expect(this.player1Object.gold).toBe(player1Gold - 1);
        expect(this.player2Object.gold).toBe(player2Gold + 1);
        expect(this.bronn.controller).toBe(this.player1Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
