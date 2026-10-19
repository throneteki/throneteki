import ForcedTriggeredAbilityWindow from '../../../server/game/gamesteps/ForcedTriggeredAbilityWindow.js';

describe('ForcedTriggeredAbilityWindow', function () {
    beforeEach(function () {
        this.player1Spy = { isTimerEnabled: vi.fn() };
        this.player1Spy.name = 'player1';
        this.player2Spy = { isTimerEnabled: vi.fn() };
        this.player2Spy.name = 'player2';

        this.gameSpy = {
            getFirstPlayer: vi.fn(),
            promptWithMenu: vi.fn(),
            resolveAbility: vi.fn()
        };
        this.gameSpy.getFirstPlayer.mockReturnValue(this.player1Spy);

        this.eventSpy = {
            emitTo: vi.fn(),
            getConcurrentEvents: vi.fn(),
            getPrimaryEvents: vi.fn()
        };
        this.eventSpy.attachedEvents = [];
        this.eventSpy.getConcurrentEvents.mockReturnValue([this.eventSpy]);
        this.eventSpy.getPrimaryEvents.mockReturnValue([this.eventSpy]);

        this.window = new ForcedTriggeredAbilityWindow(this.gameSpy, {
            event: this.eventSpy,
            abilityType: 'forcedinterrupt'
        });

        function createCard(properties) {
            let cardSpy = { getSummary: vi.fn() };
            Object.assign(cardSpy, properties);
            return cardSpy;
        }

        function createAbility(card) {
            let ability = { getChoices: vi.fn(), canResolve: vi.fn() };
            ability.card = card;
            ability.getChoices.mockReturnValue([{ choice: 'default' }]);
            ability.canResolve.mockReturnValue(true);
            return ability;
        }

        this.context1 = { context: 1, player: this.player1Spy, event: this.eventSpy };
        this.abilityCard1 = createCard({ card: 1, name: 'The Card', controller: this.player1Spy });
        this.ability1Spy = createAbility(this.abilityCard1);

        this.context2 = { context: 2, player: this.player1Spy, event: this.eventSpy };
        this.abilityCard2 = createCard({
            card: 2,
            name: 'The Card 2',
            controller: this.player1Spy
        });
        this.ability2Spy = createAbility(this.abilityCard2);

        this.context3 = { context: 3, player: this.player2Spy, event: this.eventSpy };
        this.abilityCard3 = createCard({
            card: 3,
            name: 'Their Card',
            controller: this.player2Spy
        });
        this.ability3Spy = createAbility(this.abilityCard3);

        vi.spyOn(this.window, 'gatherChoices').mockImplementation(() => {});
        vi.spyOn(this.window, 'resolveAbility').mockImplementation(() => {});
    });

    describe('continue()', function () {
        describe('when there are no remaining choices', function () {
            beforeEach(function () {
                this.result = this.window.continue();
            });

            it('should not prompt', function () {
                expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should complete the prompt', function () {
                expect(this.result).toBe(true);
            });
        });

        describe('when there is only 1 choice', function () {
            beforeEach(function () {
                this.window.gatherChoices.mockImplementation(() => {
                    this.window.registerAbility(this.ability1Spy, this.context1);
                });

                this.result = this.window.continue();
            });

            it('should resolve the ability', function () {
                expect(this.window.resolveAbility).toHaveBeenCalledWith(
                    this.ability1Spy,
                    this.context1
                );
            });

            it('should not prompt', function () {
                expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
            });

            it('should not complete the prompt', function () {
                // The execution of the forced ability may raise additional
                // abilities in the same window. Thus, the prompt should be kept
                // open until there are 0 abilities left in the window.
                // e.g. At Prince Doran's Behest could be the only 'When Revealed'
                // ability, but itself could reveal another 'When Revealed'
                // ability in the same window.
                expect(this.result).toBe(false);
            });
        });

        describe('when there are multiple choices', function () {
            beforeEach(function () {
                this.window.gatherChoices.mockImplementation(() => {
                    this.window.registerAbility(this.ability1Spy, this.context1);
                    this.window.registerAbility(this.ability2Spy, this.context2);
                    this.window.registerAbility(this.ability3Spy, this.context3);
                });
                this.result = this.window.continue();
            });

            it('should prompt the first player', function () {
                expect(this.gameSpy.promptWithMenu).toHaveBeenCalledWith(
                    this.player1Spy,
                    this.window,
                    expect.objectContaining({
                        activePrompt: {
                            menuTitle: expect.any(String),
                            buttons: [
                                expect.objectContaining({
                                    text: 'player1 - The Card',
                                    arg: expect.any(String),
                                    method: 'chooseAbility'
                                }),
                                expect.objectContaining({
                                    text: 'player1 - The Card 2',
                                    arg: expect.any(String),
                                    method: 'chooseAbility'
                                }),
                                expect.objectContaining({
                                    text: 'player2 - Their Card',
                                    arg: expect.any(String),
                                    method: 'chooseAbility'
                                })
                            ]
                        }
                    })
                );
            });

            it('should continue to prompt', function () {
                expect(this.result).toBe(false);
            });
        });
    });

    describe('chooseAbility()', function () {
        beforeEach(function () {
            this.window.registerAbility(this.ability1Spy, this.context1);
            this.choiceId = this.window.abilityChoices[0].id;
        });

        describe('when the player select a non-existent choice', function () {
            beforeEach(function () {
                this.window.chooseAbility(this.player1Spy, 'foo');
            });

            it('should not resolve an ability', function () {
                expect(this.window.resolveAbility).not.toHaveBeenCalled();
            });
        });

        describe('when the player selects a valid choice', function () {
            beforeEach(function () {
                this.window.chooseAbility(this.player1Spy, this.choiceId);
            });

            it('should resolve the ability', function () {
                expect(this.window.resolveAbility).toHaveBeenCalledWith(
                    this.ability1Spy,
                    this.context1
                );
            });
        });
    });
});
