const TriggeredAbilityWindow = require('../../../server/game/gamesteps/TriggeredAbilityWindow');

describe('TriggeredAbilityWindow', function() {
    beforeEach(function() {
        this.player1Spy = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt', 'user', 'isTimerEnabled']);
        this.player2Spy = jasmine.createSpyObj('player', ['setPrompt', 'cancelPrompt', 'user', 'isTimerEnabled']);

        this.player1Spy.noTimer = true;
        this.player2Spy.noTimer = true;

        this.gameSpy = jasmine.createSpyObj('game', ['getPlayersInFirstPlayerOrder', 'promptWithMenu', 'resolveAbility']);
        this.gameSpy.getPlayersInFirstPlayerOrder.and.returnValue([this.player1Spy, this.player2Spy]);

        this.eventSpy = jasmine.createSpyObj('event', ['emitTo', 'getConcurrentEvents', 'getPrimaryEvent']);
        this.eventSpy.attachedEvents = [];
        this.eventSpy.getConcurrentEvents.and.returnValue([this.eventSpy]);
        this.eventSpy.getPrimaryEvent.and.returnValue(this.eventSpy);

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

        function createAbility(card, context, choices = [{ choice: 'default', text: 'default' }]) {
            let ability = jasmine.createSpyObj('ability', ['createContext', 'getChoices', 'hasMax', 'meetsRequirements']);
            ability.card = card;
            ability.createContext.and.returnValue(context);
            ability.getChoices.and.returnValue(choices);
            ability.location = ['play area'];
            ability.meetsRequirements.and.returnValue(true);
            return ability;
        }

        this.context1 = { context: 1, player: this.player1Spy, event: this.eventSpy };
        this.abilityCard1 = createCard({ card: 1, name: 'The Card', controller: this.player1Spy });
        this.ability1Spy = createAbility(this.abilityCard1, this.context1, [
            { choice: 'choice1', text: 'My Choice 1' },
            { choice: 'choice2', text: 'My Choice 2' }
        ]);

        this.context2 = { context: 2, player: this.player1Spy, event: this.eventSpy };
        this.abilityCard2 = createCard({ card: 2, name: 'The Card 2', controller: this.player1Spy });
        this.ability2Spy = createAbility(this.abilityCard2, this.context2);

        this.context3 = { context: 3, player: this.player2Spy, event: this.eventSpy };
        this.abilityCard3 = createCard({ card: 3, name: 'Their Card', controller: this.player2Spy });
        this.ability3Spy = createAbility(this.abilityCard3, this.context3);
    });

    describe('continue()', function() {
        describe('when there are no remaining players', function() {
            beforeEach(function() {
                // There are remaining choices, but both players have passed
                this.window.gatherChoices.and.callFake(() => {
                    this.window.registerAbility(this.ability1Spy, this.eventSpy);
                    this.window.registerAbility(this.ability2Spy, this.eventSpy);
                    this.window.registerAbility(this.ability3Spy, this.eventSpy);
                });
                this.window.players = [];
                this.result = this.window.continue();
            });

            it('should not prompt', function() {
                expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should complete the prompt', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when there are no remaining choices', function() {
            beforeEach(function() {
                this.window.abilityChoices = [];
                this.result = this.window.continue();
            });

            it('should not prompt', function() {
                expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should complete the prompt', function() {
                expect(this.result).toBe(true);
            });
        });

        describe('when there are choices', function() {
            beforeEach(function() {
                this.window.gatherChoices.and.callFake(() => {
                    this.window.registerAbility(this.ability1Spy, this.eventSpy);
                    this.window.registerAbility(this.ability2Spy, this.eventSpy);
                    this.window.registerAbility(this.ability3Spy, this.eventSpy);
                });
            });

            describe('and all ability requirements have been met', function() {
                beforeEach(function() {
                    this.result = this.window.continue();
                });

                it('should prompt the first player', function() {
                    expect(this.gameSpy.promptWithMenu).toHaveBeenCalledWith(this.player1Spy, this.window, jasmine.objectContaining({
                        activePrompt: jasmine.objectContaining({
                            menuTitle: jasmine.any(String),
                            buttons: [
                                jasmine.objectContaining({ text: 'The Card - My Choice 1', arg: jasmine.any(String), method: 'chooseAbility' }),
                                jasmine.objectContaining({ text: 'The Card - My Choice 2', arg: jasmine.any(String), method: 'chooseAbility' }),
                                jasmine.objectContaining({ text: 'The Card 2', arg: jasmine.any(String), method: 'chooseAbility' }),
                                jasmine.objectContaining({ text: 'Pass', method: 'pass' })
                            ]
                        })
                    }));
                });

                it('should continue to prompt', function() {
                    expect(this.result).toBe(false);
                });
            });

            describe('and the ability has a maximum', function() {
                beforeEach(function() {
                    this.ability1Spy.getChoices.and.returnValue([{ choice: 'default', text: 'default' }]);
                    this.ability1Spy.hasMax.and.returnValue(true);
                    this.ability2Spy.hasMax.and.returnValue(true);
                });

                describe('and another ability from a card with that title has not been registered', function() {
                    it('should display buttons as normal', function() {
                        this.window.continue();
                        expect(this.gameSpy.promptWithMenu).toHaveBeenCalledWith(this.player1Spy, this.window, jasmine.objectContaining({
                            activePrompt: jasmine.objectContaining({
                                menuTitle: jasmine.any(String),
                                buttons: [
                                    jasmine.objectContaining({ text: 'The Card', arg: jasmine.any(String), method: 'chooseAbility' }),
                                    jasmine.objectContaining({ text: 'The Card 2', arg: jasmine.any(String), method: 'chooseAbility' }),
                                    jasmine.objectContaining({ text: 'Pass', method: 'pass' })
                                ]
                            })
                        }));
                    });
                });

                describe('and another ability from a card with that title has been registered', function() {
                    beforeEach(function() {
                        this.abilityCard2.name = 'The Card';
                        this.window.continue();
                    });

                    it('should only display the first copy', function() {
                        expect(this.gameSpy.promptWithMenu).toHaveBeenCalledWith(this.player1Spy, this.window, jasmine.objectContaining({
                            activePrompt: jasmine.objectContaining({
                                menuTitle: jasmine.any(String),
                                buttons: [
                                    jasmine.objectContaining({ text: 'The Card', arg: jasmine.any(String), method: 'chooseAbility' }),
                                    jasmine.objectContaining({ text: 'Pass', method: 'pass' })
                                ]
                            })
                        }));
                    });
                });
            });

            describe('and all abilities for the current player are not eligible', function() {
                beforeEach(function() {
                    this.ability1Spy.meetsRequirements.and.returnValue(false);
                    this.ability2Spy.meetsRequirements.and.returnValue(false);
                    this.window.continue();
                });

                it('should prompt the next player', function() {
                    expect(this.gameSpy.promptWithMenu).toHaveBeenCalledWith(this.player2Spy, this.window, jasmine.objectContaining({
                        activePrompt: jasmine.objectContaining({
                            menuTitle: jasmine.any(String),
                            buttons: [
                                jasmine.objectContaining({ text: 'Their Card', arg: jasmine.any(String), method: 'chooseAbility' }),
                                jasmine.objectContaining({ text: 'Pass', method: 'pass' })
                            ]
                        })
                    }));
                });
            });
        });
    });

    describe('chooseAbility()', function() {
        beforeEach(function() {
            this.window.registerAbility(this.ability1Spy, this.eventSpy);
            this.window.registerAbility(this.ability2Spy, this.eventSpy);
            this.window.registerAbility(this.ability3Spy, this.eventSpy);
        });

        describe('when the player select a non-existent choice', function() {
            beforeEach(function() {
                this.window.chooseAbility(this.player1Spy, 'foo');
            });

            it('should not resolve an ability', function() {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the player select a choice they do not own', function() {
            beforeEach(function() {
                // Choosing a player 2 ability
                let choice = this.window.abilityChoices[3].id;
                this.window.chooseAbility(this.player1Spy, choice);
            });

            it('should not resolve an ability', function() {
                expect(this.gameSpy.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the player selects a valid choice', function() {
            beforeEach(function() {
                let choice = this.window.abilityChoices[1].id;
                this.window.chooseAbility(this.player1Spy, choice);
            });

            it('should update the ability context with the choice made', function() {
                expect(this.context1.choice).toBe('choice2');
            });

            it('should resolve the ability', function() {
                expect(this.window.resolveAbility).toHaveBeenCalledWith(this.ability1Spy, this.context1);
            });

            it('should rotate the order of players to allow the next player pick next', function() {
                expect(this.window.players).toEqual([this.player2Spy, this.player1Spy]);
            });
        });
    });

    describe('pass()', function() {
        it('should remove the current player from prompt order', function() {
            this.window.players = [this.player1Spy, this.player2Spy];
            this.window.pass();
            expect(this.window.players).toEqual([this.player2Spy]);
        });
    });
});
