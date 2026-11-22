describe('Ser Edmure Tully', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { inPlay: ['Ser Edmure Tully', 'Khal Drogo (Core)', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.khalDrogo);
        this.player1.triggerAbility(this.serEdmureTully);
        this.player1.clickCard(this.tumblestoneKnight);
    });

    it('moves 1 power from a character that gains power to a House Tully character', function () {
        expect(this.khalDrogo.power).toBe(0);
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Ser Edmure Tully against a character immune to his ability', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'thenightswatch',
                inPlay: [{ card: 'Qhorin Halfhand', attachments: ['Dragonglass Dagger'] }]
            },
            player2: { inPlay: ['Ser Edmure Tully', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.qhorinHalfhand);
    });

    it('does not offer to move power from the immune character', function () {
        expect(this.player2).not.toAllowAbilityTrigger(this.serEdmureTully);
        expect(this.qhorinHalfhand.power).toBe(1);
        expect(this.tumblestoneKnight.power).toBe(0);
        expect(this.serEdmureTully.power).toBe(0);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe('Ser Edmure Tully against an opponent character that is not immune', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: { faction: 'thenightswatch', inPlay: ['Qhorin Halfhand'] },
            player2: { inPlay: ['Ser Edmure Tully', 'Tumblestone Knight'] }
        });
        this.unopposedChallenge(this.player1, 'Power', this.qhorinHalfhand);
    });

    it('moves 1 power from that character', function () {
        expect(this.player2).toAllowAbilityTrigger(this.serEdmureTully);
        this.player2.triggerAbility(this.serEdmureTully);
        this.player2.clickCard(this.tumblestoneKnight);

        expect(this.qhorinHalfhand.power).toBe(0);
        expect(this.tumblestoneKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
