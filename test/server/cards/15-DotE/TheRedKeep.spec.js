describe('The Red Keep (DotE)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['The Red Keep (DotE)'] },
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

    it("kneels to cancel the effects of an opponent's triggered character, location or attachment ability", function () {
        expect(this.theRedKeep.kneeled).toBe(true);
        expect(this.tumblestoneKnight.kneeled).toBe(true);
        expect(this.player2).isReadyToTakeAction();
    });
});

describe("The Red Keep (DotE) when an opponent uses your character's ability", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { faction: 'lannister', inPlay: ['The Red Keep (DotE)', 'Bronn (CoW)'] },
            player2: { gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.bronn);
    });

    it('kneels to cancel it', function () {
        expect(this.player1).toAllowAbilityTrigger(this.theRedKeep);

        this.player1.triggerAbility(this.theRedKeep);

        expect(this.theRedKeep.kneeled).toBe(true);
        expect(this.bronn.controller).toBe(this.player1Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
