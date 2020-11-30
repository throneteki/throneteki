const TheRainsOfCastamere = require('../../../../server/game/cards/05-LoCR/TheRainsOfCastamere.js');

describe('The Rains of Castamere', function() {
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

    beforeEach(function() {
        this.gameSpy = jasmine.createSpyObj('game', ['on', 'registerAbility', 'addMessage', 'queueStep']);

        this.plot1 = plot('1111');
        this.plot2 = plot('2222');
        this.scheme1 = scheme('3333');
        this.scheme2 = scheme('4444');

        this.player = jasmine.createSpyObj('player', ['kneelCard', 'moveCard']);
        this.player.game = this.gameSpy;
        this.player.faction = {};

        this.agenda = new TheRainsOfCastamere(this.player, {});
    });

    describe('onPlotDiscarded()', function() {
        beforeEach(function() {
            this.plotSpy = jasmine.createSpyObj('plot', ['hasTrait']);
            this.plotSpy.controller = this.player;
            this.event = { player: this.player, card: this.plotSpy };
        });

        describe('when the plot is a scheme and controlled by the player', function() {
            beforeEach(function() {
                this.plotSpy.hasTrait.and.callFake(trait => trait === 'Scheme');
                this.agenda.onPlotDiscarded(this.event);
            });

            it('should move the card out of the game', function() {
                expect(this.player.moveCard).toHaveBeenCalledWith(this.plotSpy, 'out of game');
            });
        });

        describe('when the plot is a scheme and controlled by the opponent', function() {
            beforeEach(function() {
                this.plotSpy.hasTrait.and.callFake(trait => trait === 'Scheme');
                this.plotSpy.controller = {};
                this.agenda.onPlotDiscarded(this.event);
            });

            it('should not move the card', function() {
                expect(this.player.moveCard).not.toHaveBeenCalled();
            });
        });

        describe('when the plot is not a scheme', function() {
            beforeEach(function() {
                this.plotSpy.hasTrait.and.returnValue(false);
                this.agenda.onPlotDiscarded(this.event);
            });

            it('should not move the card', function() {
                expect(this.player.moveCard).not.toHaveBeenCalled();
            });
        });
    });

    describe('afterChallenge()', function() {
        beforeEach(function() {
            this.challenge = { challengeType: 'intrigue', winner: this.player, strengthDifference: 5 };
            this.event = { challenge: this.challenge };
            this.reaction = this.agenda.abilities.reactions[0];
        });

        describe('when the challenge type is not intrigue', function() {
            beforeEach(function() {
                this.challenge.challengeType = 'power';
            });

            it('should not trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event)).toBe(false);
            });
        });

        describe('when the challenge winner is not the Castamere player', function() {
            beforeEach(function() {
                this.challenge.winner = {};
            });

            it('should not trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event)).toBe(false);
            });
        });

        describe('when the strength difference is less than 5', function() {
            beforeEach(function() {
                this.challenge.strengthDifference = 4;
            });

            it('should not trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event)).toBe(false);
            });
        });

        describe('when all triggering criteria are met', function() {
            it('should trigger', function() {
                expect(this.reaction.when.afterChallenge(this.event)).toBe(true);
            });

            it('should register the ability', function() {
                let event = { name: 'afterChallenge', challenge: this.challenge };
                this.reaction.eventHandler(event);
                expect(this.gameSpy.registerAbility).toHaveBeenCalledWith(this.reaction, event);
            });
        });
    });

    integration(function() {
        beforeEach(function() {
            const deck = this.buildDeck('lannister', [
                '"The Rains of Castamere"',
                'Trading with the Pentoshi', 'Wardens of the West', 'The Red Wedding',
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

        it('should allow a scheme to be played', function() {
            this.player1.clickCard(this.wardens);

            expect(this.player1Object.activePlot).toBe(this.wardens);
        });

        it('should allow reactions in the current reaction window to trigger', function() {
            this.player1.clickCard(this.wardens);

            expect(this.player1).toAllowAbilityTrigger('Wardens of the West');
        });

        it('should not allow interrupts in the current window to trigger since the current window is for reactions only', function() {
            this.player1.clickCard(this.wedding);

            expect(this.player1).not.toAllowAbilityTrigger('The Red Wedding');
        });
    });
});
