describe('Highgarden Courtier', function () {
    integration(function () {
        describe('interacting with a character with dynamic strength', function () {
            beforeEach(function () {
                const deck = this.buildDeck('Stark', [
                    'Dacey Mormont',
                    'Highgarden Courtier',
                    'Alysane Mormont',
                    'Alysane Mormont',
                    'Skagos (R)',
                    'Bolton Flayer',
                    'I Am No One (R)',
                    'Trading with the Pentoshi',
                    'Confiscation',
                    'The Withering Cold'
                ]);

                const opposingDeck = this.buildDeck('Targaryen', [
                    'Trading with the Pentoshi',
                    'Confiscation',
                    'The Withering Cold',
                    'Strangler',
                    'Milk of the Poppy',
                    'Unsullied'
                ]);

                this.player1.selectDeck(deck);
                this.player2.selectDeck(opposingDeck);

                this.startGame();
                this.keepStartingHands();

                this.dacey = this.player1.findCardByName('Dacey Mormont', 'hand');
                this.aly = this.player1.findCardByName('Alysane Mormont', 'hand');
                this.courtier = this.player1.findCardByName('Highgarden Courtier', 'hand');
                this.skagos = this.player1.findCardByName('Skagos (R)', 'hand');
                this.milk = this.player2.findCardByName('Milk of the Poppy', 'hand');
                this.strangler = this.player2.findCardByName('Strangler', 'hand');
                this.flayer = this.player1.findCardByName('Bolton Flayer', 'hand');
                this.noOne = this.player1.findCardByName('I Am No One (R)', 'hand');
                this.unsullied = this.player2.findCardByName('Unsullied', 'hand');

                this.player1.clickCard(this.dacey);
                this.player1.clickCard(this.courtier);
                this.player1.clickCard(this.skagos);
                this.player1.clickPrompt('Setup');

                this.player2.clickCard(this.unsullied);

                this.completeSetup();
                this.player1.selectPlot('Trading with the Pentoshi');
                this.player2.selectPlot('The Withering Cold');

                this.selectFirstPlayer(this.player1);
            });

            it('should react to a strength increase caused by a card entering play', function () {
                this.player1.clickCard(this.dacey);
                expect(this.dacey.kneeled).toBe(true);
                this.player1.clickCard(this.aly);
                this.player1.triggerAbility(this.courtier);
                expect(this.dacey.kneeled).toBe(false);
            });

            it('should react to a strength increase when the strength was just decreased by paying the cost of the same action', function () {
                this.player1.clickCard(this.aly);
                let otherAly = this.player1.findCardByName('Alysane Mormont', 'hand');
                this.player1.dragCard(otherAly, 'draw deck');

                this.player1.clickCard(this.dacey);
                expect(this.dacey.kneeled).toBe(true);
                this.player1.clickMenu('Skagos', 'Replace standing Stark card');
                this.player1.clickCard(this.aly);
                this.player1.clickCard(otherAly);
                this.player1.triggerAbility(this.courtier);
                expect(this.dacey.kneeled).toBe(false);
            });

            it('should react to a strength increase caused by a dynamic strength ability becoming unblanked', function () {
                this.player1.clickPrompt('Done');
                this.player2.clickCard(this.milk);
                this.player2.clickCard(this.dacey);

                this.player2.clickPrompt('Done');
                this.unopposedChallenge(this.player1, 'power', this.dacey);
                //no claim because Dacey is blanked
                this.completeChallengesPhase();
                expect(this.game.currentPhase).toBe('plot');
                expect(this.dacey.kneeled).toBe(true);

                this.player1.selectPlot('Confiscation');
                this.player2.selectPlot('Trading with the Pentoshi');

                this.selectFirstPlayer(this.player1);
                this.selectPlotOrder(this.player1);

                //player still has to select milk, even though it is the only choice
                this.player1.triggerAbility(this.milk);
                expect(this.milk.location).toBe('discard pile');
                this.player1.triggerAbility(this.courtier);
                expect(this.dacey.kneeled).toBe(false);
            });

            it('should not react to a strength set effect wearing off', function () {
                this.player1.clickCard(this.flayer);
                this.player1.clickPrompt('Marshal into shadows');
                this.player1.clickCard(this.aly);
                this.player1.clickPrompt('done');
                this.player2.clickCard(this.strangler);
                this.player2.clickCard(this.dacey);
                this.player2.clickPrompt('done');

                this.player1.clickPrompt('power');
                this.player1.clickCard(this.dacey);
                this.player1.clickPrompt('done');
                expect(this.dacey.getStrength()).toBe(1);
                this.player1.clickCard(this.flayer);
                this.player2.clickPrompt('pass');
                this.player1.clickPrompt('pass');
                //player 2 to select defenders
                this.player2.clickPrompt('done');
                this.player1.clickPrompt('pass');
                this.player2.clickPrompt('pass');
                this.player1.clickPrompt('Apply claim');
                this.player1.clickCard(this.dacey);
                expect(this.dacey.getStrength()).toBe(3);
                expect(this.player1).not.toAllowAbilityTrigger(this.courtier);
            });

            it('should not rect to a negative strength modifier wearing off', function () {
                this.completeMarshalPhase();
                expect(this.dacey.getStrength()).toBe(1);
                this.player1.clickPrompt('Done');
                this.player2.clickPrompt('power');
                this.player2.clickCard(this.unsullied);
                this.player2.clickPrompt('done');
                this.player1.clickPrompt('pass');
                this.player2.clickPrompt('pass');
                this.player1.clickCard(this.dacey);
                this.player1.clickPrompt('done');
                expect(this.dacey.getStrength()).toBe(0);
                this.player1.clickPrompt('pass');
                this.player2.clickPrompt('pass');
                this.player2.clickPrompt('Apply claim');
                expect(this.dacey.getStrength()).toBe(1);
                expect(this.player1).not.toAllowAbilityTrigger(this.courtier);
            });

            it('should react to a strength increase due to an effect on another card wearing off', function () {
                this.player1.clickCard(this.aly);
                this.completeMarshalPhase();
                this.player1.clickCard(this.noOne);
                this.player1.clickCard(this.aly);
                expect(this.dacey.getStrength()).toBe(1);
                this.unopposedChallenge(this.player1, 'power', this.dacey);
                this.player1.clickPrompt('Apply Claim');
                //no need to select for renown
                this.player1.clickPrompt('done');
                this.player2.clickPrompt('done');
                expect(this.dacey.getStrength()).toBe(2);
                this.player1.triggerAbility(this.courtier);
                expect(this.dacey.kneeled).toBe(false);
                expect(this.dacey.getStrength()).toBe(2);
            });

        });
    });
});
