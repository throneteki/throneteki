describe('Obara Sand (SoD)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Obara Sand (SoD)', 'Arianne Martell (Core)'],
                hand: ['Bastard Daughter', 'Southron Messenger']
            }
        });
        this.player1.clickMenu(this.obaraSand, 'Put character into play');
        this.player1.clickCard(this.obaraSand);
        this.player1.clickCard(this.bastardDaughter);
    });

    it('returns a Sand Snake to your hand to put a cheaper martell character into play', function () {
        expect(this.obaraSand.location).toBe('hand');
        expect(this.bastardDaughter.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });

    it('can be used again after she leaves play and comes back', function () {
        this.player1.clickMenu(this.arianneMartell, 'Put character into play');
        this.player1.clickCard(this.obaraSand);
        this.player1.clickMenu(this.obaraSand, 'Put character into play');
        this.player1.clickCard(this.obaraSand);
        this.player1.clickCard(this.southronMessenger);

        expect(this.southronMessenger.location).toBe('play area');
        expect(this.player1).isReadyToTakeAction();
    });
});
