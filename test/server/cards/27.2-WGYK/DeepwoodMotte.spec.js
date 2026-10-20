describe('Deepwood Motte', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            player1: {
                faction: 'greyjoy',
                plot: 'A Song of Summer',
                inPlay: [
                    'Deepwood Motte (WGYK)',
                    'The Riverroad',
                    "Brynden's Outriders (FtR)",
                    { card: "Black Wind's Crew", kneeling: true },
                    { card: 'Tumblestone Knight', kneeling: true },
                    'Orkmont Reaver'
                ]
            },
            player2: {
                faction: 'targaryen',
                inPlay: [
                    'Grey Cliffs',
                    "Mother's Men",
                    { card: 'Raider from Pyke (CoW)', kneeling: true }
                ]
            }
        });
    });

    it('gives its controller -2 initiative', function () {
        expect(this.player1Object.getInitiative()).toBe(
            this.aSongOfSummer.cardData.plotStats.initiative - 2
        );
    });

    describe('when a location is knelt by assault in a challenge you initiate', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Military');
            this.player1.clickCard(this.bryndensOutriders);
            this.player1.clickPrompt('Done');
            this.player1.clickCard(this.greyCliffs);
            this.skipActionWindow();
            this.player2.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('can be triggered', function () {
            expect(this.greyCliffs.kneeled).toBe(true);
            expect(this.player1).toAllowAbilityTrigger(this.deepwoodMotte);
        });

        describe('and it is triggered', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.deepwoodMotte);
            });

            it('can only choose a kneeling Raider character you control', function () {
                expect(this.player1).toBeAbleToSelect(this.blackWindsCrew);
                expect(this.player1).not.toBeAbleToSelect(this.orkmontReaver);
                expect(this.player1).not.toBeAbleToSelect(this.tumblestoneKnight);
                expect(this.player1).not.toBeAbleToSelect(this.raiderFromPyke);
                expect(this.player1).not.toBeAbleToSelect(this.mothersMen);
            });

            it('kneels Deepwood Motte to stand the character', function () {
                this.player1.clickCard(this.blackWindsCrew);

                expect(this.deepwoodMotte.kneeled).toBe(true);
                expect(this.blackWindsCrew.kneeled).toBe(false);
                expect(this.tumblestoneKnight.kneeled).toBe(true);
                expect(this.raiderFromPyke.kneeled).toBe(true);
                expect(this.player1).toHavePromptButton('Apply Claim');
            });
        });
    });

    describe('when your location is knelt by assault in a challenge you defend', function () {
        beforeEach(function () {
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Military');
            this.player2.clickCard(this.mothersMen);
            this.player2.clickPrompt('Done');
            this.player2.clickCard(this.theRiverroad);
            this.skipActionWindow();
            this.player1.clickPrompt('Done');
            this.skipActionWindow();
        });

        it('cannot be triggered', function () {
            expect(this.theRiverroad.kneeled).toBe(true);
            expect(this.player1).not.toAllowAbilityTrigger(this.deepwoodMotte);
        });
    });
});
