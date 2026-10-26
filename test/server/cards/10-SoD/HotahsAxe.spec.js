describe("Hotah's Axe", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                hand: ['Areo Hotah (Core)', "Hotah's Axe"],
                gold: 5
            }
        });
        this.player1.clickCard(this.areoHotah);
    });

    it('puts itself into play from your hand attached to a Martell character that entered play during the challenges phase', function () {
        this.player1.triggerAbility("Hotah's Axe");
        expect(this.hotahsAxe.parent).toBe(this.areoHotah);
        expect(this.areoHotah.getStrength()).toBe(this.areoHotah.getPrintedStrength() + 3);
        expect(this.player1Object.gold).toBe(0);
    });
});

describe("Hotah's Axe after Desert Raider enters play", function () {
    it('waits until Desert Raider has taken its icon', function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'martell',
                deadPile: ['Desert Raider (KotI)'],
                hand: ["Hotah's Axe"],
                gold: 5
            },
            player2: { inPlay: ['Courtesan of the Rose'] }
        });
        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Power', this.courtesanOfTheRose);
        this.player1.triggerAbility('Desert Raider');
        this.player1.clickCard(this.courtesanOfTheRose);
        this.player1.clickPrompt('Power');
        this.player1.triggerAbility("Hotah's Axe");

        expect(this.desertRaider.hasIcon('power')).toBe(true);
        expect(this.hotahsAxe.parent).toBe(this.desertRaider);
    });
});
