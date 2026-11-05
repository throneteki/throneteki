describe('White Sword Tower', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                hand: ['Quiet as a Shadow', 'Tithe'],
                inPlay: ['White Sword Tower', 'Ser Parmen Crane (ChoS)', 'House Maester'],
                drawDeck: ['Hedge Knight', 'Nightmares']
            },
            player2: {
                hand: ["The Dragon's Tail (AtSK)", 'Defiance'],
                inPlay: ['Bastard in Hiding'],
                drawDeck: ['Hedge Knight', 'Nightmares']
            }
        });
    });

    it('gives +1 STR only to Kingsguard characters you control', function () {
        expect(this.serParmenCrane.getStrength()).toBe(4);
        expect(this.houseMaester.getStrength()).toBe(2);
        expect(this.bastardInHiding.getStrength()).toBe(2);
        expect(this.player1).isReadyToTakeAction();
    });

    it('lets you play a second event while you control a Kingsguard character', function () {
        this.player1.clickCard(this.quietAsAShadow);
        this.player1.clickCard(this.serParmenCrane);
        this.player1.clickCard(this.tithe);
        this.player1.clickCard(this.houseMaester);

        expect(this.quietAsAShadow.location).toBe('discard pile');
        expect(this.tithe.location).toBe('discard pile');
        expect(this.houseMaester.kneeled).toBe(true);
        expect(this.player1).isReadyToTakeAction();
    });

    it('stops a player with no Kingsguard character playing a second event', function () {
        this.player1.clickPrompt('Done');
        this.player2.clickCard(this.theDragonsTail);

        expect(this.theDragonsTail.location).toBe('discard pile');
        expect(this.player2.actionUnavailableReason(this.defiance)).toBe('cost');
        expect(this.defiance.location).toBe('hand');
        expect(this.player2).isReadyToTakeAction();
    });
});
