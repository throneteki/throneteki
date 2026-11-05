describe('The Horn that Wakes the Sleepers', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    { card: 'Grizzled Miner', kneeling: true },
                    { card: 'Ranging Party', kneeling: true },
                    { card: 'Steward at the Wall', kneeling: true }
                ],
                hand: ['The Horn that Wakes the Sleepers']
            },
            player2: { inPlay: ['Hedge Knight'] }
        });
        this.player1.clickPrompt('Done');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.hedgeKnight);
        this.player2.clickPrompt('Done');
        this.player1.triggerAbility('The Horn that Wakes the Sleepers');
        this.player1.clickCard(this.grizzledMiner);
        this.player1.clickCard(this.rangingParty);
        this.player1.clickCard(this.stewardAtTheWall);
    });

    it('stands a Builder, a Ranger and a Steward after an opponent initiates a challenge against you', function () {
        expect(this.grizzledMiner.kneeled).toBe(false);
        expect(this.rangingParty.kneeled).toBe(false);
        expect(this.stewardAtTheWall.kneeled).toBe(false);
    });
});
