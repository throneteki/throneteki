describe('The Red Keep (R)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['The Red Keep (R)'], gold: 1 },
            player2: {
                inPlay: ['Magister Illyrio (Core)', { card: 'Tumblestone Knight', kneeling: true }],
                gold: 2
            }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.magisterIllyrio);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.theRedKeep);
    });

    it("kneels and pays 1 gold to cancel the effects of an opponent's triggered character, location or attachment ability", function () {
        expect(this.player1Object.gold).toBe(0);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});

describe("The Red Keep (R) when an opponent uses your character's ability", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['The Red Keep (R)', 'Bronn (CoW)'], gold: 1 },
            player2: { gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.bronn);
    });

    it('kneels and pays 1 gold to cancel it', function () {
        expect(this.player1).toAllowAbilityTrigger(this.theRedKeep);

        this.player1.triggerAbility(this.theRedKeep);

        expect(this.theRedKeep.kneeled).toBe(true);
        expect(this.player1Object.gold).toBe(0);
        expect(this.bronn.controller).toBe(this.player1Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
