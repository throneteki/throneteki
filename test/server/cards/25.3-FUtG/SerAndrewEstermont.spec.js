describe('Ser Andrew Estermont', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Ser Andrew Estermont', 'Fiery Followers']
            },
            player2: {
                inPlay: ['Ser Jaime Lannister (Core)']
            }
        });

        this.player1.clickPrompt('Done');
        this.unopposedChallenge(this.player2, 'Military', this.serJaimeLannister);
        this.player1.clickCard(this.serAndrewEstermont);
    });

    it("kills a R'hllor character to save a unique baratheon character from being killed and give it 1 power", function () {
        this.player1.triggerAbility(this.serAndrewEstermont);
        this.player1.clickCard(this.fieryFollowers);

        expect(this.serAndrewEstermont.location).toBe('play area');
        expect(this.serAndrewEstermont.power).toBe(1);
        expect(this.fieryFollowers.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
