describe('Captain of the Iron Fleet (THBIB)', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                inPlay: [
                    {
                        card: "Black Wind's Crew",
                        attachments: ['Captain of the Iron Fleet (THBIB)']
                    },
                    'Iron Fleet Scout'
                ]
            },
            player2: { inPlay: ['Burned Men'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.burnedMen);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.player1.clickCard(this.captainOfTheIronFleet);
        this.player1.clickCard(this.ironFleetScout);
    });

    it('gives the attached character the Captain trait, and kneels with a Warship to have it contribute its STR to your side', function () {
        expect(this.blackWindsCrew.hasTrait('Captain')).toBe(true);
        expect(this.game.currentChallenge.defenderStrength).toBe(3);
        expect(this.player2).isReadyToTakeAction();
    });
});
