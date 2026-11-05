describe('Direwolf Pup', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'marshal',
            player1: {
                hand: ['Ghost (ChoS)'],
                inPlay: ['Direwolf Pup', 'Grey Wind (Core)', 'Tumblestone Knight']
            },
            player2: {
                inPlay: ['Nymeria (FotOG)']
            }
        });
    });

    it('gets +1 STR for each other Direwolf card you control', function () {
        expect(this.direwolfPup.getStrength()).toBe(2);
        expect(this.greyWind.getStrength()).toBe(4);
        expect(this.nymeria.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });

    it('updates when another Direwolf enters play', function () {
        this.player1.clickCard(this.ghost);

        expect(this.direwolfPup.getStrength()).toBe(3);
        expect(this.player1).isReadyToTakeAction();
    });
});
