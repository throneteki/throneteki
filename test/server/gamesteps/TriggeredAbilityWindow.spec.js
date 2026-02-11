import TriggeredAbilityWindow from '../../../server/game/gamesteps/TriggeredAbilityWindow.js';

describe('TriggeredAbilityWindow', function () {
    beforeEach(function () {
        this.player1Spy = jasmine.createSpyObj('player', [
            'setPrompt',
            'cancelPrompt',
            'user',
            'isTimerEnabled',
            'isPlaying'
        ]);
        this.player2Spy = jasmine.createSpyObj('player', [
            'setPrompt',
            'cancelPrompt',
            'user',
            'isTimerEnabled',
            'isPlaying'
        ]);

        this.player1Spy.noTimer = true;
        this.player1Spy.isPlaying.and.returnValue(true);
        this.player2Spy.noTimer = true;
        this.player2Spy.isPlaying.and.returnValue(true);

        this.gameSpy = jasmine.createSpyObj('game', [
            'getPlayersInFirstPlayerOrder',
            'promptForSelect',
            'resolveAbility'
        ]);
        this.gameSpy.getPlayersInFirstPlayerOrder.and.returnValue([
            this.player1Spy,
            this.player2Spy
        ]);

        this.eventSpy = jasmine.createSpyObj('event', [
            'emitTo',
            'getConcurrentEvents',
            'getPrimaryEvents'
        ]);
        this.eventSpy.attachedEvents = [];
        this.eventSpy.getConcurrentEvents.and.returnValue([this.eventSpy]);
        this.eventSpy.getPrimaryEvents.and.returnValue([this.eventSpy]);

        this.window = new TriggeredAbilityWindow(this.gameSpy, {
            event: this.eventSpy,
            abilityType: 'interrupt'
        });

        spyOn(this.window, 'gatherChoices');
        spyOn(this.window, 'resolveAbility');

        function createCard(properties) {
            let cardSpy = jasmine.createSpyObj('card', ['getSummary']);
            cardSpy.location = 'play area';
            Object.assign(cardSpy, properties);
            return cardSpy;
        }

        function createAbility(card) {
            let ability = jasmine.createSpyObj('ability', ['getTitle', 'hasMax', 'canResolve']);
            ability.card = card;
            ability.location = ['play area'];
            ability.canResolve.and.returnValue(true);
            return ability;
        }

        this.context1 = { context: 1, player: this.player1Spy, event: this.eventSpy };
        this.abilityCard1 = createCard({
            uuid: '111',
            name: 'The Card',
            controller: this.player1Spy
        });
        this.ability1Spy = createAbility(this.abilityCard1);

        this.context2 = { context: 2, player: this.player1Spy, event: this.eventSpy };
        this.abilityCard2 = createCard({
            uuid: '222',
            name: 'The Card 2',
            controller: this.player1Spy
        });
        this.ability2Spy = createAbility(this.abilityCard2);

        this.context3 = { context: 3, player: this.player2Spy, event: this.eventSpy };
        this.abilityCard3 = createCard({
            uuid: '333',
            name: 'Their Card',
            controller: this.player2Spy
        });
        this.ability3Spy = createAbility(this.abilityCard3);
    });

    describe('continue()', function () {
        describe('when there are no remaining players', function () {
            beforeEach(function () {
                // There are remaining choices, but both players have passed
                this.window.gatherChoices.and.callFake(() => {
                    this.window.registerAbility(this.ability1Spy, this.context1);
                    this.window.registerAbility(this.ability2Spy, this.context2);
                    this.window.registerAbility(this.ability3Spy, this.context3);
                });
                this.window.players = [];
                this.result = this.window.continue();
            });

            it('should not prompt', function () {
                expect(this.gameSpy.promptForSelect).not.toHaveBeenCalled();
            });

            it('should complete the prompt', function () {
                expect(this.result).toBe(true);
            });
        });

        describe('when there are no remaining choices', function () {
            beforeEach(function () {
                this.window.abilityChoices = [];
                this.result = this.window.continue();
            });

            it('should not prompt', function () {
                expect(this.gameSpy.promptForSelect).not.toHaveBeenCalled();
            });

            it('should complete the prompt', function () {
                expect(this.result).toBe(true);
            });
        });

        describe('when there are choices', function () {
            beforeEach(function () {
                this.window.gatherChoices.and.callFake(() => {
                    this.window.registerAbility(this.ability1Spy, this.context1);
                    this.window.registerAbility(this.ability2Spy, this.context2);
                    this.window.registerAbility(this.ability3Spy, this.context3);
                });
            });

            describe('and all ability requirements have been met', function () {
                beforeEach(function () {
                    this.result = this.window.continue();
                });

                it('should prompt the first player', function () {
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.player1Spy,
                        jasmine.any(Object)
                    );
                });

                it('should continue to prompt', function () {
                    expect(this.result).toBe(false);
                });
            });
        });
    });

    describe('chooseAbility()', function () {
        beforeEach(function () {
            this.window.registerAbility(this.ability1Spy, this.context1);
            this.window.registerAbility(this.ability2Spy, this.context2);
            this.window.registerAbility(this.ability3Spy, this.context3);
        });

        describe('when the player select a non-existent choice', function () {
            beforeEach(function () {
                this.window.chooseAbility(this.player1Spy, 'foo');
            });

            it('should not resolve an ability', function () {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the player select a choice they do not own', function () {
            beforeEach(function () {
                // Choosing a player 2 ability
                let choice = this.window.abilityChoices[2];
                this.window.chooseAbility(choice);
            });

            it('should not resolve an ability', function () {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the player selects a valid choice', function () {
            beforeEach(function () {
                let choice = this.window.abilityChoices[1];
                this.window.chooseAbility(choice);
            });

            it('should resolve the ability', function () {
                expect(this.window.resolveAbility).toHaveBeenCalledWith(
                    this.ability2Spy,
                    this.context2
                );
            });

            it('should rotate the order of players to allow the next player pick next', function () {
                expect(this.window.players).toEqual([this.player2Spy, this.player1Spy]);
            });
        });
    });

    describe('pass()', function () {
        it('should remove the current player from prompt order', function () {
            this.window.players = [this.player1Spy, this.player2Spy];
            this.window.pass();
            expect(this.window.players).toEqual([this.player2Spy]);
        });
    });
});
