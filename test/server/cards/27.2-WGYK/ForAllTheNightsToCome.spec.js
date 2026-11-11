describe('For All the Nights to Come (WGYK)', function () {
    describe('with a Builder, a Ranger and a Steward', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: [
                        'Old Bear Mormont (Core)',
                        'Steward at the Wall',
                        'Veteran Builder',
                        'Old Forest Hunter'
                    ],
                    hand: ['For All the Nights to Come (WGYK)']
                }
            });
        });

        it('gives each of them 1 power after you win a challenge by 5 or more STR', function () {
            this.unopposedChallenge(this.player1, 'Military', this.oldBearMormont);

            expect(this.player1).toAllowAbilityTrigger(this.forAllTheNightsToCome);
            this.player1.triggerAbility(this.forAllTheNightsToCome);
            this.player1.clickCard(this.veteranBuilder);
            this.player1.clickCard(this.oldForestHunter);
            this.player1.clickCard(this.stewardAtTheWall);

            expect(this.veteranBuilder.getPower()).toBe(1);
            expect(this.oldForestHunter.getPower()).toBe(1);
            expect(this.stewardAtTheWall.getPower()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });

        it('is not offered after you win a challenge by less than 5 STR', function () {
            this.unopposedChallenge(this.player1, 'Intrigue', this.stewardAtTheWall);

            expect(this.player1).not.toAllowAbilityTrigger(this.forAllTheNightsToCome);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when one character fills more than one Trait', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    inPlay: ['Old Bear Mormont (Core)', 'Veteran Builder', 'Great Ranging (FtR)'],
                    hand: ['For All the Nights to Come (WGYK)']
                }
            });
            this.unopposedChallenge(this.player1, 'Military', this.oldBearMormont);
            this.player1.triggerAbility(this.forAllTheNightsToCome);
            this.player1.clickCard(this.veteranBuilder);
            this.player1.clickCard(this.greatRanging);
            this.player1.clickCard(this.greatRanging);
        });

        it('gives that character only 1 power', function () {
            expect(this.greatRanging.getPower()).toBe(1);
            expect(this.veteranBuilder.getPower()).toBe(1);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
