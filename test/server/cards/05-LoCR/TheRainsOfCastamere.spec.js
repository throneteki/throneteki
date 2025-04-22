import TheRainsOfCastamere from '../../../../server/game/cards/05-LoCR/TheRainsOfCastamere.js';
import Event from '../../../../server/game/event.js';

describe('The Rains of Castamere', function () {
    function createPlotSpy(uuid, hasTrait) {
        var plot = jasmine.createSpyObj('plot', ['hasTrait', 'moveTo']);
        plot.uuid = uuid;
        plot.hasTrait.and.callFake(hasTrait);
        return plot;
    }

    function plot(uuid) {
        return createPlotSpy(uuid, () => false);
    }

    function scheme(uuid) {
        return createPlotSpy(uuid, (trait) => trait === 'Scheme');
    }

    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', [
            'on',
            'registerAbility',
            'addMessage',
            'queueStep'
        ]);

        this.plot1 = plot('1111');
        this.plot2 = plot('2222');
        this.scheme1 = scheme('3333');
        this.scheme2 = scheme('4444');

        this.player = jasmine.createSpyObj('player', ['kneelCard', 'moveCard', 'hasFlag']);
        this.player.game = this.gameSpy;
        this.player.faction = {};

        this.agenda = new TheRainsOfCastamere(this.player, {});
    });

    describe('onPlotDiscarded()', function () {
        beforeEach(function () {
            this.plotSpy = jasmine.createSpyObj('plot', ['hasTrait']);
            this.plotSpy.controller = this.player;
            this.event = { player: this.player, card: this.plotSpy };
        });

        describe('when the plot is a scheme and controlled by the player', function () {
            beforeEach(function () {
                this.plotSpy.hasTrait.and.callFake((trait) => trait === 'Scheme');
                this.agenda.onPlotDiscarded(this.event);
            });

            it('should move the card out of the game', function () {
                expect(this.player.moveCard).toHaveBeenCalledWith(this.plotSpy, 'out of game');
            });
        });

        describe('when the plot is a scheme and controlled by the opponent', function () {
            beforeEach(function () {
                this.plotSpy.hasTrait.and.callFake((trait) => trait === 'Scheme');
                this.plotSpy.controller = {};
                this.agenda.onPlotDiscarded(this.event);
            });

            it('should not move the card', function () {
                expect(this.player.moveCard).not.toHaveBeenCalled();
            });
        });

        describe('when the plot is not a scheme', function () {
            beforeEach(function () {
                this.plotSpy.hasTrait.and.returnValue(false);
                this.agenda.onPlotDiscarded(this.event);
            });

            it('should not move the card', function () {
                expect(this.player.moveCard).not.toHaveBeenCalled();
            });
        });
    });

    describe('afterChallenge()', function () {
        beforeEach(function () {
            this.challenge = {
                challengeType: 'intrigue',
                winner: this.player,
                strengthDifference: 5
            };
            this.event = { challenge: this.challenge };
            this.reaction = this.agenda.abilities.reactions[0];
        });

        describe('when the challenge type is not intrigue', function () {
            beforeEach(function () {
                this.challenge.challengeType = 'power';
            });

            it('should not trigger', function () {
                expect(this.reaction.abilityTriggers[0].condition(this.event)).toBe(false);
            });
        });

        describe('when the challenge winner is not the Castamere player', function () {
            beforeEach(function () {
                this.challenge.winner = {};
            });

            it('should not trigger', function () {
                expect(this.reaction.abilityTriggers[0].condition(this.event)).toBe(false);
            });
        });

        describe('when the strength difference is less than 5', function () {
            beforeEach(function () {
                this.challenge.strengthDifference = 4;
            });

            it('should not trigger', function () {
                expect(this.reaction.abilityTriggers[0].condition(this.event)).toBe(false);
            });
        });

        describe('when all triggering criteria are met', function () {
            it('should trigger', function () {
                expect(this.reaction.abilityTriggers[0].condition(this.event)).toBe(true);
            });

            it('should register the ability', function () {
                const event = new Event('afterChallenge', { challenge: this.challenge });
                this.reaction.abilityTriggers[0].eventHandler(event);
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(
                    this.reaction,
                    jasmine.objectContaining({
                        ability: this.reaction,
                        event: event,
                        game: this.gameSpy,
                        source: this.agenda
                    })
                );
            });
        });
    });

    integration(function () {
        beforeEach(function () {
            const deck = this.buildDeck('lannister', [
                '"The Rains of Castamere"',
                'Trading with the Pentoshi',
                'Wardens of the West',
                'The Red Wedding',
                'Cersei Lannister (LoCR)'
            ]);
            this.player1.selectDeck(deck);
            this.player2.selectDeck(deck);
            this.startGame();
            this.keepStartingHands();
            this.player1.clickCard('Cersei Lannister', 'hand');
            this.completeSetup();
            this.selectFirstPlayer(this.player1);
            this.selectPlotOrder(this.player1);
            this.completeMarshalPhase();

            this.player1.clickPrompt('Intrigue');
            this.player1.clickCard('Cersei Lannister', 'play area');
            this.player1.clickPrompt('Done');

            this.skipActionWindow();

            this.player2.clickPrompt('Done');

            this.skipActionWindow();

            this.wardens = this.player1.findCardByName('Wardens of the West');
            this.wedding = this.player1.findCardByName('The Red Wedding');

            this.player1.triggerAbility('"The Rains of Castamere"');
        });

        it('should allow a scheme to be played', function () {
            this.player1.clickCard(this.wardens);

            expect(this.player1Object.activePlot).toBe(this.wardens);
        });

        it('should allow reactions in the current reaction window to trigger', function () {
            this.player1.clickCard(this.wardens);

            expect(this.player1).toAllowAbilityTrigger('Wardens of the West');
        });

        it('should not allow interrupts in the current window to trigger since the current window is for reactions only', function () {
            this.player1.clickCard(this.wedding);

            expect(this.player1).not.toAllowAbilityTrigger('The Red Wedding');
        });
    });

    integration(function () {
        beforeEach(function () {
            const starkDeck = this.buildDeck('stark', [
                'Trading with the Pentoshi',
                'A Noble Cause'
            ]);
            const martellRainsDeck = this.buildDeck('martell', [
                "At Prince Doran's Behest",
                '"The Rains of Castamere"',
                'Trading with the Pentoshi',
                'Filthy Accusations',
                'A Song of Summer',
                'The Long Plan',
                'Dorne (R)',
                'Nymeria of Ny Sar',
                'The Red Viper (Core)',
                'House Dayne Knight'
            ]);

            this.player1.selectDeck(starkDeck);
            this.player2.selectDeck(martellRainsDeck);
            this.startGame();
            this.keepStartingHands();

            this.dorne = this.player2.findCardByName('Dorne', 'hand');
            this.nym = this.player2.findCardByName('Nymeria of Ny Sar', 'hand');
            this.viper = this.player2.findCardByName('The Red Viper', 'hand');
            this.martellScheme = this.player2.findCardByName('The Long Plan', 'plot deck');
            this.neutralScheme = this.player2.findCardByName('Filthy Accusations', 'plot deck');
            this.behest = this.player2.findCardByName("At Prince Doran's Behest", 'plot deck');
            this.martellPentoshi = this.player2.findCardByName(
                'Trading with the Pentoshi',
                'plot deck'
            );
            this.songOfSummer = this.player2.findCardByName('A Song of Summer', 'plot deck');
            this.rains = this.player2.findCardByName('"The Rains of Castamere"');

            this.player2.clickCard(this.viper);

            this.completeSetup();
        });

        /*************************************************
         * This test is for a case that requires a change in the game rules to fix
         ***************************************************/
        // it('should recycle plots when the plot deck consists only of cards not considered to be in the plot deck', function () {
        //     this.player1.selectPlot('Trading with the Pentoshi');
        //     this.player2.selectPlot("At Prince Doran's Behest");
        //     this.selectFirstPlayer(this.player2);
        //     this.selectPlotOrder(this.player1);
        //     this.player2.clickCard(this.martellPentoshi);
        //     this.player2.clickCard(this.dorne);
        //     this.player2.clickCard(this.nym);
        //     this.player2.clickCard(this.dorne);

        //     this.completeMarshalPhase();
        //     this.unopposedChallenge(this.player2, 'Power', this.viper);

        //     this.player2.triggerAbility(this.nym);
        //     this.player2.clickCard(this.songOfSummer);
        //     this.player2.clickCard(this.viper);
        //     this.player2.clickPrompt('Apply Claim');

        //     expect(this.martellPentoshi.location).toBe('revealed plots');
        //     this.completeChallengesPhase();
        //     //game engine resolves dominance and taxation without player input
        //     expect(this.martellPentoshi.location).toBe('plot deck');
        // });

        it('should not prevent Nymeria of Ny Sar from revealing a scheme plot', function () {
            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player2);
            this.player2.clickCard(this.dorne);
            this.player2.clickCard(this.nym);
            this.player2.clickCard(this.dorne);

            this.completeMarshalPhase();
            this.unopposedChallenge(this.player2, 'Power', this.viper);

            this.player2.triggerAbility(this.nym);
            this.player2.clickCard(this.martellScheme);
            expect(this.martellScheme.location).toBe('active plot');
        });

        it("should not prevent Nymeria of Ny Sar from revealing a scheme plot indirectly with At Prince Doran's Behest", function () {
            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player2);
            this.player2.clickCard(this.dorne);
            this.player2.clickCard(this.nym);
            this.player2.clickCard(this.dorne);

            this.completeMarshalPhase();
            this.unopposedChallenge(this.player2, 'Power', this.viper);

            this.player2.triggerAbility(this.nym);
            this.player2.clickCard(this.behest);
            this.player2.clickCard(this.neutralScheme);
            expect(this.neutralScheme.location).toBe('active plot');
        });

        it('should recycle plots immediately when its reaction causes the plot deck to be exhausted', function () {
            this.player1.selectPlot('Trading with the Pentoshi');
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player1);
            this.player2.clickCard(this.dorne);
            this.player2.clickCard(this.nym);
            this.player2.clickCard(this.dorne);

            this.completeMarshalPhase();
            this.completeChallengesPhase();
            this.player2.selectPlot('A Song of Summer');
            this.selectFirstPlayer(this.player2);
            this.completeMarshalPhase();

            this.unopposedChallenge(this.player2, 'Intrigue', this.viper);

            this.player2.triggerAbility(this.nym);
            this.player2.clickCard(this.behest);
            this.player2.clickCard(this.martellScheme);
            this.player2.clickCard(this.viper);
            this.player2.triggerAbility(this.rains);
            this.player2.clickCard(this.neutralScheme);
            this.player2.clickPrompt('Apply Claim');

            expect(this.player2Object.getNumberOfUsedPlots()).toBe(0);
        });
    });
});
