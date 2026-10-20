describe('Wolves of the North', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                inPlay: ['Wolves of the North', 'Direwolf Pup', 'Arya Stark (Core)']
            },
            player2: {
                inPlay: ['Ranging Party', 'Bastard in Hiding', 'Ghost (ChoS)']
            }
        });
    });

    describe('when it bypasses a character using stealth', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.wolvesOfTheNorth);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rangingParty);
        });

        it('gives that character -X STR until the end of the phase, where X is the number of Direwolf cards you control', function () {
            this.player1.triggerAbility(this.wolvesOfTheNorth);

            expect(this.rangingParty.getStrength()).toBe(3);
            expect(this.bastardInHiding.getStrength()).toBe(2);
            expect(this.ghost.getStrength()).toBe(3);
            expect(this.wolvesOfTheNorth.getStrength()).toBe(3);
            expect(this.direwolfPup.getStrength()).toBe(2);
            expect(this.game.getPlainTextLog()).toContain(
                'player1 uses Wolves of the North to give Ranging Party -2 STR until the end of the phase'
            );

            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
            this.player1.clickPrompt('Apply Claim');
            this.player2.clickCard(this.bastardInHiding);

            expect(this.rangingParty.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();

            this.completeChallengesPhase();

            expect(this.rangingParty.getStrength()).toBe(5);
        });
    });

    describe('when another character bypasses a character using stealth', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.aryaStark);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.rangingParty);
        });

        it('cannot be triggered', function () {
            expect(this.player1).not.toAllowAbilityTrigger(this.wolvesOfTheNorth);
            expect(this.rangingParty.getStrength()).toBe(5);
            expect(this.player1).toHavePrompt('Initiate an action');
        });
    });
});
