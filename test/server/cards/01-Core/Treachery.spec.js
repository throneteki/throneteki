describe('Treachery', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                hand: ['Treachery'],
                inPlay: ['Ser Jaime Lannister (Core)'],
                gold: 1
            },
            player2: {
                inPlay: ['Magister Illyrio (Core)', { card: 'Tumblestone Knight', kneeling: true }],
                gold: 2
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.magisterIllyrio);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.treachery);
    });

    it('cancels the effects of a triggered character, location or attachment ability while you control a unique lannister character', function () {
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});

describe("Treachery when an opponent uses your character's ability", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                faction: 'lannister',
                hand: ['Treachery'],
                inPlay: ['Ser Jaime Lannister (Core)', 'Bronn (CoW)'],
                gold: 1
            },
            player2: { gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.bronn);
    });

    it('cancels the ability', function () {
        expect(this.player1).toAllowAbilityTrigger(this.treachery);

        this.player1.triggerAbility(this.treachery);

        expect(this.bronn.controller).toBe(this.player1Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
