describe("Drowned God's Blessing", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ["Drowned God's Blessing"],
                inPlay: ['Salty Navigator', 'Tumblestone Knight']
            },
            player2: {
                hand: ['Nightmares']
            }
        });

        this.player1.clickCard(this.drownedGodsBlessing);
    });

    it("can only be attached to a [greyjoy] character, which gains the Drowned God trait and cannot be the only target of opponents' events", function () {
        expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);

        this.player1.clickCard(this.saltyNavigator);

        expect(this.saltyNavigator.hasTrait('Drowned God')).toBe(true);
        expect(this.player1Object.getInitiative()).toBe(2);

        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.nightmares);

        expect(this.player2).not.toBeAbleToSelect(this.saltyNavigator);
        expect(this.player2).toBeAbleToSelect(this.tumblestoneKnight);

        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.player2).isReadyToTakeAction();
    });
});
