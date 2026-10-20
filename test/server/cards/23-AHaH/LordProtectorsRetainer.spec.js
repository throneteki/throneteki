describe("Lord Protector's Retainer", function () {
    function revealPlot(context) {
        context.setupTest({
            phase: 'plot',
            player1: {
                inPlay: ['Edric Dayne (HMW)', 'House Maester', "Lord Protector's Retainer"]
            },
            player2: {
                plot: 'Filthy Accusations'
            }
        });

        context.player1.selectPlot('Filler Plot');
        context.player2.selectPlot('Filthy Accusations');
        context.selectFirstPlayer(context.player2);
    }

    describe('when an ability chooses a Lord or Lady you control as its only target', function () {
        beforeEach(function () {
            revealPlot(this);
            this.player2.clickCard(this.edricDayne);
        });

        it('returns to your hand and cancels those effects', function () {
            this.player1.triggerAbility(this.lordProtectorsRetainer);

            expect(this.lordProtectorsRetainer.location).toBe('hand');
            expect(this.edricDayne.kneeled).toBe(false);
            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });

        it('can be declined', function () {
            this.player1.clickPrompt('Pass');

            expect(this.lordProtectorsRetainer.location).toBe('play area');
            expect(this.edricDayne.kneeled).toBe(true);
            expect(this.houseMaester.kneeled).toBe(false);
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when the only chosen character is not a Lord or Lady', function () {
        beforeEach(function () {
            revealPlot(this);
            this.player2.clickCard(this.houseMaester);
        });

        it('does not cancel the effects', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.lordProtectorsRetainer);
            expect(this.houseMaester.kneeled).toBe(true);
            expect(this.edricDayne.kneeled).toBe(false);
            expect(this.lordProtectorsRetainer.location).toBe('play area');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});

describe("Lord Protector's Retainer, against stealth", function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                inPlay: ['Edric Dayne (HMW)', "Lord Protector's Retainer"]
            },
            player2: {
                faction: 'greyjoy',
                inPlay: ['Maester Wendamyr']
            }
        });

        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.maesterWendamyr);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.edricDayne);
    });

    it('cancels stealth choosing a Lord or Lady you control', function () {
        this.player1.triggerAbility(this.lordProtectorsRetainer);

        expect(this.lordProtectorsRetainer.location).toBe('hand');
        expect(this.edricDayne.bypassedByStealth).toBe(false);
        expect(this.player2).toHavePrompt('Initiate an action');
    });
});
