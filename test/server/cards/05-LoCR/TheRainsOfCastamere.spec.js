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
            const starkDeck = this.buildDeck('stark', ['Trading with the Pentoshi']);
            const martellRainsDeck = this.buildDeck('martell', [
                '"The Rains of Castamere"',
                'Trading with the Pentoshi',
                'Filthy Accusations',
                'A Song of Summer',
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
            this.martellPentoshi = this.player2.findCardByName(
                'Trading with the Pentoshi',
                'plot deck'
            );
            this.songOfSummer = this.player2.findCardByName('A Song of Summer', 'plot deck');

            this.player2.clickCard(this.viper);

            this.completeSetup();
        });

        it('should not prevent plot recycling when usable plots are exhausted in the challenge phase', function () {
            this.player2.selectPlot('Trading with the Pentoshi');
            this.selectFirstPlayer(this.player2);
            this.selectPlotOrder(this.player2);
            this.player2.clickCard(this.dorne);
            this.player2.clickCard(this.nym);
            this.player2.clickCard(this.dorne);

            this.completeMarshalPhase();
            this.unopposedChallenge(this.player2, 'Power', this.viper);

            this.player2.triggerAbility(this.nym);
            this.player2.clickCard('A Song of Summer');

            expect(this.martellPentoshi.location).toBe('plot deck');
        });
    });
});
