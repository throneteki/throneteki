describe('burn', function () {
    function burn(context, defender) {
        context.player2.clickPrompt('Military');
        context.player2.clickCard(context.drogon);
        context.player2.clickPrompt('Done');
        context.skipActionWindow();
        context.player1.clickCard(defender);
        context.player1.clickPrompt('Done');
        context.player2.clickCard(context.dracarys);
        context.player2.clickCard(context.viserion);
        context.player2.clickCard(defender);
    }

    function setup(context, defender) {
        context.setupTest({
            phase: 'challenge',
            firstPlayer: 'player2',
            player1: { inPlay: [defender] },
            player2: {
                faction: 'targaryen',
                gold: 1,
                hand: ['Dracarys!'],
                inPlay: ['Drogon (Core)', 'Viserion (Core)']
            }
        });
    }

    describe('when a save would not remedy the 0 STR', function () {
        beforeEach(function () {
            setup(this, { card: 'Ser Eldon Estermont', attachments: ['Bodyguard (Core)'] });
            burn(this, this.serEldonEstermont);
        });

        it('kills the character without offering the save', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.bodyguard);
            expect(this.serEldonEstermont.location).toBe('dead pile');
            expect(this.bodyguard.location).toBe('hand');
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('when the character has a duplicate', function () {
        beforeEach(function () {
            setup(this, { card: 'Ser Eldon Estermont', dupes: 1 });
            burn(this, this.serEldonEstermont);
        });

        it('kills the character without the duplicate saving it', function () {
            expect(this.serEldonEstermont.location).toBe('dead pile');
            expect(this.player1Object.deadPile).toHaveLength(1);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe('when the character cannot be killed', function () {
        beforeEach(function () {
            setup(this, 'Balerion (FH)');
            burn(this, this.balerion);
        });

        it('leaves it in play at 0 STR', function () {
            expect(this.balerion.getStrength()).toBe(0);
            expect(this.balerion.location).toBe('play area');
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });

    describe("when the character's own STR is recalculated while it is being killed", function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                firstPlayer: 'player2',
                player1: {
                    hand: ['Fight to the Last'],
                    inPlay: ['Sansa Stark (WotN)'],
                    deadPile: ['Winterfell Steward']
                },
                player2: {
                    faction: 'targaryen',
                    hand: ['Consuming Flames', 'Dracarys!'],
                    inPlay: ['Khal Drogo (Core)'],
                    gold: 2
                }
            });
            this.player2.clickPrompt('Power');
            this.player2.clickCard(this.khalDrogo);
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickCard(this.sansaStark);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.consumingFlames);
            this.player2.clickCard(this.dracarys);
            this.player2.clickCard(this.sansaStark);
            this.player1.triggerAbility('Fight to the Last');
        });

        it('does not kill it again once a save has taken it above 0 STR', function () {
            expect(this.sansaStark.location).toBe('play area');
            expect(this.sansaStark.getStrength()).toBe(1);
        });
    });
});
