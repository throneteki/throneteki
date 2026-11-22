describe("The Regent's Council", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Grand Maester Pycelle (Core)', 'Tumblestone Knight'],
                hand: ["The Regent's Council"]
            }
        });
        this.startingPower = this.player1Object.faction.power;
        this.unopposedChallenge(this.player1, 'Intrigue', this.grandMaesterPycelle);
        this.player1.triggerAbility("The Regent's Council");
    });

    it('determines dominance after you win an intrigue challenge with a participating Small Council character', function () {
        expect(this.player1Object.faction.power).toBe(this.startingPower + 1 + 1);
        expect(this.player1).isReadyToTakeAction();
    });
});

describe("The Regent's Council (not triggered)", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: [
                    'Grand Maester Pycelle (Core)',
                    'Courtesan of the Rose',
                    'House Dayne Knight'
                ],
                hand: ["The Regent's Council"]
            },
            player2: {
                inPlay: ['Ser Kevan Lannister (LoCR)']
            }
        });
    });

    it('cannot be played after you lose an intrigue challenge with a participating Small Council character', function () {
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.grandMaesterPycelle);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serKevanLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).not.toAllowAbilityTrigger("The Regent's Council");
        expect(this.theRegentsCouncil.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });

    it('cannot be played after you win when only an opponent controls a participating Small Council character', function () {
        this.player1.clickPrompt('Intrigue');
        this.player1.clickCard(this.courtesanOfTheRose);
        this.player1.clickCard(this.houseDayneKnight);
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player2.clickCard(this.serKevanLannister);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();

        expect(this.player1).not.toAllowAbilityTrigger("The Regent's Council");
        expect(this.theRegentsCouncil.location).toBe('hand');
        expect(this.player1).isReadyToTakeAction();
    });
});
