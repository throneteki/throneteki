describe('Fear Cuts Deeper Than Swords', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                gold: 2,
                hand: ['Fear Cuts Deeper Than Swords'],
                inPlay: [{ card: 'Bear Island Scout (R)', kneeling: true }, 'Samwell Tarly (Core)']
            },
            player2: {
                inPlay: ['Grey Wind (Core)']
            }
        });

        this.player2.clickMenu(this.greyWind, 'Kneel Grey Wind to kill a character');
    });

    describe('when an ability chooses a [stark] character you control as its only target', function () {
        beforeEach(function () {
            this.player2.clickCard(this.bearIslandScout);
        });

        it('cancels its effects and stands that character', function () {
            this.player1.triggerAbility(this.fearCutsDeeperThanSwords);

            expect(this.bearIslandScout.location).toBe('play area');
            expect(this.bearIslandScout.kneeled).toBe(false);
            expect(this.greyWind.kneeled).toBe(true);
            expect(this.fearCutsDeeperThanSwords.location).toBe('discard pile');
            expect(this.player1Object.gold).toBe(0);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 plays Fear Cuts Deeper Than Swords to cancel Grey Wind and stand Bear Island Scout'
            );
            expect(this.player2).isReadyToTakeAction();
        });

        it('lets the effects resolve when declined', function () {
            this.player1.clickPrompt('Pass');

            expect(this.bearIslandScout.location).toBe('dead pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });

    describe('when the only target is a non-[stark] character', function () {
        beforeEach(function () {
            this.player2.clickCard(this.samwellTarly);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.fearCutsDeeperThanSwords);
            expect(this.samwellTarly.location).toBe('dead pile');
            expect(this.player2).isReadyToTakeAction();
        });
    });
});

describe('Fear Cuts Deeper Than Swords, against keywords', function () {
    function setup(context, attacker) {
        context.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: {
                gold: 2,
                hand: ['Fear Cuts Deeper Than Swords'],
                inPlay: ['Tumblestone Knight', 'House Maester']
            },
            player2: {
                faction: 'greyjoy',
                inPlay: [attacker]
            }
        });
    }

    it('cancels intimidate choosing a [stark] character you control', function () {
        setup(this, 'Grey Wind (Core)');
        this.player2.clickPrompt('Military');
        this.player2.clickCard(this.greyWind);
        this.player2.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickPrompt('Done');
        this.skipActionWindow();
        this.player1.clickCard(this.houseMaester);
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.fearCutsDeeperThanSwords);

        expect(this.houseMaester.location).toBe('dead pile');
        expect(this.tumblestoneKnight.kneeled).toBe(false);
        expect(this.fearCutsDeeperThanSwords.location).toBe('discard pile');
        expect(this.player2).isReadyToTakeAction();
    });

    it('cancels stealth choosing a [stark] character you control', function () {
        setup(this, 'Maester Wendamyr');
        this.player2.clickPrompt('Power');
        this.player2.clickCard(this.maesterWendamyr);
        this.player2.clickPrompt('Done');
        this.player2.clickCard(this.tumblestoneKnight);
        this.player1.triggerAbility(this.fearCutsDeeperThanSwords);

        expect(this.tumblestoneKnight.bypassedByStealth).toBe(false);
        expect(this.fearCutsDeeperThanSwords.location).toBe('discard pile');
        expect(this.player2).toHavePrompt('Initiate an action');
    });
});
