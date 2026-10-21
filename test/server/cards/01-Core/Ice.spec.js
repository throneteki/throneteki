describe('Ice (Core)', function () {
    describe('when marshaled', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    hand: ['Ice (Core)'],
                    inPlay: ['Tumblestone Knight', 'House Maester']
                }
            });

            this.player1.clickCard(this.ice);
        });

        it('can only be attached to a [stark] character', function () {
            expect(this.player1).toBeAbleToSelect(this.tumblestoneKnight);
            expect(this.player1).not.toBeAbleToSelect(this.houseMaester);
        });
    });

    describe('while attached', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: [
                        { card: 'Tumblestone Knight', attachments: ['Ice (Core)'] },
                        'Winterfell Steward'
                    ]
                },
                player2: {
                    inPlay: ['House Maester', 'Bastard in Hiding']
                }
            });
        });

        it('gives +2 STR', function () {
            expect(this.tumblestoneKnight.getStrength()).toBe(4);
        });

        it('can be sacrificed to kill a character controlled by the losing opponent after you win a [military] challenge in which the attached character is participating', function () {
            this.unopposedChallenge(this.player1, 'Military', this.tumblestoneKnight);
            this.player1.triggerAbility(this.ice);

            expect(this.player1).toBeAbleToSelect(this.houseMaester);
            expect(this.player1).not.toBeAbleToSelect(this.winterfellSteward);

            this.player1.clickCard(this.houseMaester);

            expect(this.houseMaester.location).toBe('dead pile');
            expect(this.ice.location).toBe('discard pile');
            expect(this.game.getPlainTextLog()).toContain(
                'player1 sacrifices Ice to kill House Maester'
            );
        });

        it('cannot be triggered when the attached character is not participating', function () {
            this.unopposedChallenge(this.player1, 'Power', this.winterfellSteward);

            expect(this.player1).not.toAllowAbilityTrigger(this.ice);
        });
    });
});
