describe('By Sword or By Guile', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'targaryen',
                gold: 1,
                hand: ['By Sword or By Guile'],
                inPlay: ['Viserion (Core)', 'Host of the Boneway', 'House Dayne Knight']
            },
            player2: {
                power: 3,
                inPlay: [{ card: 'Bastard in Hiding', kneeling: true }]
            }
        });
    });

    describe('when military claim is applied while you control an attacking Dragon', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Military', this.viserion);
        });

        it('can be triggered', function () {
            expect(this.player1).toAllowAbilityTrigger(this.bySwordOrByGuile);

            this.player1.clickPrompt('Pass');
            this.player2.clickCard(this.bastardInHiding);

            expect(this.player1).isReadyToTakeAction();
        });

        it('applies power claim instead', function () {
            this.player1.triggerAbility(this.bySwordOrByGuile);

            expect(this.bastardInHiding.location).toBe('play area');
            expect(this.player2Object.faction.power).toBe(2);
            expect(this.player1Object.gold).toBe(0);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when intrigue claim is applied while you control an attacking Army', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Intrigue', this.hostOfTheBoneway);
        });

        it('applies power claim instead', function () {
            this.player1.triggerAbility(this.bySwordOrByGuile);

            expect(this.player2Object.faction.power).toBe(2);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when no attacking character is an Army or Dragon', function () {
        beforeEach(function () {
            this.unopposedChallenge(this.player1, 'Intrigue', this.houseDayneKnight);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.bySwordOrByGuile);
            expect(this.player2Object.faction.power).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
