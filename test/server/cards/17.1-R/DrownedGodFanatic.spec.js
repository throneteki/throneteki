describe('Drowned God Fanatic (R)', function () {
    it('kills a Greyjoy character you own and control to put itself into play from your dead pile', function () {
        this.setupTest({
            player1: {
                faction: 'greyjoy',
                inPlay: ['Drowned Men', 'Hedge Knight'],
                deadPile: ['Drowned God Fanatic (R)']
            }
        });
        this.player1.clickCard(this.drownedGodFanatic);
        expect(this.player1).not.toBeAbleToSelect(this.hedgeKnight);
        this.player1.clickCard(this.drownedMen);
        expect(this.drownedMen.location).toBe('dead pile');
        expect(this.drownedGodFanatic.location).toBe('play area');
    });

    it("discards itself from your hand to cancel an opponent's triggered character ability", function () {
        this.setupTest({
            firstPlayer: 'player2',
            player1: { faction: 'greyjoy', hand: ['Drowned God Fanatic (R)'] },
            player2: { hand: ['Littlefinger (Core)'], gold: 5 }
        });
        this.player2.clickCard(this.littlefinger);
        this.player2.triggerAbility('Littlefinger');
        this.player1.triggerAbility('Drowned God Fanatic');
        expect(this.drownedGodFanatic.location).toBe('discard pile');
        expect(this.player2Object.hand.length).toBe(0);
    });
});

describe("Drowned God Fanatic (R) when an opponent uses your character's ability", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: { hand: ['Drowned God Fanatic (R)'], inPlay: ['Bronn (CoW)'] },
            player2: { gold: 1 }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.bronn);
    });

    it('is discarded from your hand to cancel it', function () {
        expect(this.player1).toAllowAbilityTrigger(this.drownedGodFanatic);

        this.player1.triggerAbility(this.drownedGodFanatic);

        expect(this.drownedGodFanatic.location).toBe('discard pile');
        expect(this.bronn.controller).toBe(this.player1Object);
        expect(this.player2).isReadyToTakeAction();
    });
});
