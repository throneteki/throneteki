describe('Family, Duty, Honor', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                hand: ['Family, Duty, Honor'],
                inPlay: [
                    { card: 'Tumblestone Knight', power: 1 },
                    { card: 'House Maester', power: 1 },
                    'Catelyn Stark (Core)'
                ]
            },
            player2: {
                inPlay: ['Braided Warrior']
            }
        });

        this.unopposedChallenge(this.player2, 'Military', this.braidedWarrior);
    });

    it('discards 1 power from a House Tully character you control to save it', function () {
        this.player1.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.familyDutyHonor);
        this.player1.clickCard(this.tumblestoneKnight);

        expect(this.tumblestoneKnight.location).toBe('play area');
        expect(this.tumblestoneKnight.power).toBe(0);
        expect(this.familyDutyHonor.location).toBe('discard pile');
        expect(this.game.getPlainTextLog()).toContain(
            'player1 plays Family, Duty, Honor and discards 1 power from Tumblestone Knight to save it'
        );
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot save a House Tully character with no power', function () {
        this.player1.clickCard(this.catelynStark);

        expect(this.player1).not.toAllowAbilityTrigger(this.familyDutyHonor);
        expect(this.catelynStark.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('cannot save a character without the House Tully trait', function () {
        this.player1.clickCard(this.houseMaester);

        expect(this.player1).not.toAllowAbilityTrigger(this.familyDutyHonor);
        expect(this.houseMaester.location).toBe('dead pile');
        expect(this.player2).isReadyToTakeAction();
    });
});
