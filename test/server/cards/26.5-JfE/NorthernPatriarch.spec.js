describe('Northern Patriarch', function () {
    describe('while an opponent has an Omen plot revealed', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'marshal',
                player1: {
                    faction: 'stark',
                    inPlay: ['Northern Patriarch', 'Winterfell (WotN)', 'Tumblestone Knight']
                },
                player2: {
                    plot: 'At the Palace of Sorrows (R)'
                }
            });
        });

        it("is immune to that plot's effects", function () {
            expect(this.northernPatriarch.getStrength()).toBe(4);
            expect(this.tumblestoneKnight.getStrength()).toBe(3);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when an opponent plays an event', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Northern Patriarch', 'Tumblestone Knight']
                },
                player2: {
                    gold: 2,
                    power: 1,
                    hand: ['Nightmares', 'Nightmares'],
                    inPlay: [{ card: 'Bastard in Hiding', power: 1 }]
                }
            });

            this.player2.clickCard(this.nightmares);
            this.player2.clickCard(this.tumblestoneKnight);
        });

        it('is offered as an interrupt', function () {
            expect(this.player1).toAllowAbilityTrigger(this.northernPatriarch);
            expect(this.player2).not.toAllowAbilityTrigger(this.northernPatriarch);

            this.player1.clickPrompt('Pass');
            expect(this.tumblestoneKnight.isAnyBlank()).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        describe('and Northern Patriarch is used', function () {
            beforeEach(function () {
                this.player1.triggerAbility(this.northernPatriarch);
            });

            it('cancels the event if that player does not move power', function () {
                this.player2.clickPrompt('Do not move power');

                expect(this.nightmares.location).toBe('discard pile');
                expect(this.tumblestoneKnight.isAnyBlank()).toBe(false);
                expect(this.player2Object.faction.power).toBe(1);
                expect(this.northernPatriarch.power).toBe(0);
                expect(this.player1).isReadyToTakeAction();
            });

            it('does not cancel the event if that player moves 1 power', function () {
                this.player2.clickPrompt('Move 1 power');
                expect(this.player2).toBeAbleToSelect(this.bastardInHiding);
                expect(this.player2).toBeAbleToSelect(this.player2Object.faction);
                expect(this.player2).not.toBeAbleToSelect(this.northernPatriarch);
                this.player2.clickCard(this.bastardInHiding);

                expect(this.tumblestoneKnight.isAnyBlank()).toBe(true);
                expect(this.bastardInHiding.power).toBe(0);
                expect(this.player2Object.faction.power).toBe(1);
                expect(this.northernPatriarch.power).toBe(1);
                expect(this.player1).isReadyToTakeAction();
            });

            it('can only be used once per round', function () {
                this.player2.clickPrompt('Do not move power');
                this.player2.clickCard(this.player2.filterCardsByName('Nightmares', 'hand')[0]);
                this.player2.clickCard(this.tumblestoneKnight);

                expect(this.player1).not.toAllowAbilityTrigger(this.northernPatriarch);
                expect(this.tumblestoneKnight.isAnyBlank()).toBe(true);
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('when that player has no power to move', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'challenge',
                player1: {
                    faction: 'stark',
                    inPlay: ['Northern Patriarch', 'Tumblestone Knight']
                },
                player2: {
                    gold: 1,
                    hand: ['Nightmares']
                }
            });

            this.player2.clickCard(this.nightmares);
            this.player2.clickCard(this.tumblestoneKnight);
            this.player1.triggerAbility(this.northernPatriarch);
        });

        it('cancels the event', function () {
            expect(this.nightmares.location).toBe('discard pile');
            expect(this.tumblestoneKnight.isAnyBlank()).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });
});
