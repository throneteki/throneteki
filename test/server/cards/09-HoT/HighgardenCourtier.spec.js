describe('Highgarden Courtier', function () {
    function setup(context, { daceyKneeling = false } = {}) {
        context.setupTest({
            phase: 'marshal',
            player1: {
                plot: 'Trading with the Pentoshi',
                plotDeck: ['Confiscation', 'Filler Plot'],
                inPlay: [
                    { card: 'Dacey Mormont', kneeling: daceyKneeling },
                    'Highgarden Courtier',
                    'Skagos (R)'
                ],
                hand: ['Alysane Mormont', 'Bolton Flayer'],
                deck: ['Alysane Mormont']
            },
            player2: {
                plot: 'The Withering Cold',
                plotDeck: ['Trading with the Pentoshi', 'Filler Plot'],
                inPlay: ['Unsullied'],
                hand: ['Milk of the Poppy', 'Strangler']
            }
        });
        context.alysane = context.player1.findCardByName('Alysane Mormont', 'hand');
        context.otherAlysane = context.player1.findCardByName('Alysane Mormont', 'draw deck');
    }

    describe('when a character with dynamic STR is kneeling', function () {
        beforeEach(function () {
            setup(this, { daceyKneeling: true });
        });

        it('kneels to stand it after a card entering play increases its STR', function () {
            this.player1.clickCard(this.alysane);

            expect(this.player1).toAllowAbilityTrigger(this.highgardenCourtier);
            this.player1.triggerAbility(this.highgardenCourtier);

            expect(this.daceyMormont.kneeled).toBe(false);
            expect(this.highgardenCourtier.kneeled).toBe(true);
            expect(this.player1).isReadyToTakeAction();
        });

        it('reacts when the STR was just decreased by paying the cost of the same action', function () {
            this.player1.clickCard(this.alysane);
            this.player1.clickPrompt('Pass');
            this.player1.clickMenu(this.skagos, 'Replace standing Stark card');
            this.player1.clickCard(this.alysane);
            this.player1.clickCard(this.otherAlysane);

            expect(this.player1).toAllowAbilityTrigger(this.highgardenCourtier);
            this.player1.triggerAbility(this.highgardenCourtier);

            expect(this.daceyMormont.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a dynamic STR ability is unblanked', function () {
        beforeEach(function () {
            setup(this);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.milkOfThePoppy);
            this.player2.clickCard(this.daceyMormont);
            this.player2.clickPrompt('Done');
            this.unopposedChallenge(this.player1, 'Power', this.daceyMormont);
            this.completeChallengesPhase();
        });

        it('reacts to the STR increase', function () {
            expect(this.game.currentPhase).toBe('plot');
            expect(this.daceyMormont.kneeled).toBe(true);

            this.player1.selectPlot('Confiscation');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
            this.player1.clickCard(this.milkOfThePoppy);

            expect(this.milkOfThePoppy.location).toBe('discard pile');
            expect(this.player1).toAllowAbilityTrigger(this.highgardenCourtier);
            this.player1.triggerAbility(this.highgardenCourtier);

            expect(this.daceyMormont.kneeled).toBe(false);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a STR-setting effect wears off', function () {
        beforeEach(function () {
            setup(this);
            this.player1.clickCard(this.boltonFlayer);
            this.player1.clickPrompt('Marshal into shadows');
            this.player1.clickCard(this.alysane);
            this.player1.clickPrompt('Done');
            this.player2.clickCard(this.strangler);
            this.player2.clickCard(this.daceyMormont);
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Power');
            this.player1.clickCard(this.daceyMormont);
            this.player1.clickPrompt('Done');
        });

        it('does not react', function () {
            expect(this.daceyMormont.getStrength()).toBe(1);

            this.player1.clickCard(this.boltonFlayer);
            this.player2.clickPrompt('Pass');
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');

            expect(this.daceyMormont.getStrength()).toBe(3);
            expect(this.player1).not.toAllowAbilityTrigger(this.highgardenCourtier);
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when a negative STR modifier wears off', function () {
        beforeEach(function () {
            setup(this);
            this.completeMarshalPhase();
            this.player1.clickPrompt('Done');
            this.player2.clickPrompt('Power');
            this.player2.clickCard(this.unsullied);
            this.player2.clickPrompt('Done');
            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');
            this.player1.clickCard(this.daceyMormont);
            this.player1.clickPrompt('Done');
        });

        it('does not react', function () {
            expect(this.daceyMormont.getStrength()).toBe(0);

            this.player1.clickPrompt('Pass');
            this.player2.clickPrompt('Pass');

            expect(this.daceyMormont.getStrength()).toBe(1);
            expect(this.player1).not.toAllowAbilityTrigger(this.highgardenCourtier);
            expect(this.player2).isReadyToTakeAction();
        });
    });
});
