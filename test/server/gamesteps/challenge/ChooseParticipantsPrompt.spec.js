import ChooseParticipantsPrompt from '../../../../server/game/gamesteps/challenge/ChooseParticipantsPrompt.js';

describe('ChooseParticipantsPrompt', function () {
    beforeEach(function () {
        this.gameSpy = jasmine.createSpyObj('game', ['addAlert', 'addMessage', 'promptForSelect']);
        this.limitsSpy = jasmine.createSpyObj('limits', ['getMax', 'getMin']);
        this.limitsSpy.getMax.and.returnValue(0);
        this.limitsSpy.getMin.and.returnValue(0);
        this.playerSpy = jasmine.createSpyObj('player', [
            'getNumberOfCardsInPlay',
            'filterCardsInPlay'
        ]);
        this.playerSpy.getNumberOfCardsInPlay.and.returnValue(10);
        this.playerSpy.filterCardsInPlay.and.returnValue([]);
        this.playerSpy.genericLimits = this.limitsSpy;
        this.onSelectSpy = jasmine.createSpy('onSelect');
        this.properties = {
            challengeType: 'military',
            gameAction: 'GAME_ACTION',
            mustBeDeclaredOption: 'FORCED_DECLARE_OPTION',
            limitsProperty: 'genericLimits',
            activePromptTitle: 'Select participants',
            waitingPromptTitle: 'Waiting for opponent to declare participants',
            messages: {},
            onSelect: this.onSelectSpy
        };
        this.prompt = new ChooseParticipantsPrompt(this.gameSpy, this.playerSpy, this.properties);
    });

    describe('continue()', function () {
        describe('when there are no forced participants', function () {
            it('prompts the choosing player', function () {
                this.prompt.continue();
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                    this.playerSpy,
                    jasmine.objectContaining({
                        activePromptTitle: 'Select participants',
                        waitingPromptTitle: 'Waiting for opponent to declare participants'
                    })
                );
            });

            describe('when there is a minimum number of participants', function () {
                beforeEach(function () {
                    this.limitsSpy.getMin.and.returnValue(23);
                });

                it('adds the requirement to the prompt title', function () {
                    this.prompt.continue();
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.playerSpy,
                        jasmine.objectContaining({
                            activePromptTitle: 'Select participants (min 23)'
                        })
                    );
                });
            });

            describe('when there is a maximum number of participants', function () {
                beforeEach(function () {
                    this.limitsSpy.getMax.and.returnValue(45);
                });

                it('adds the requirement to the prompt title', function () {
                    this.prompt.continue();
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.playerSpy,
                        jasmine.objectContaining({
                            activePromptTitle: 'Select participants (max 45)'
                        })
                    );
                });

                it('limits the number of cards that can be selected', function () {
                    this.prompt.continue();
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.playerSpy,
                        jasmine.objectContaining({
                            numCards: 45
                        })
                    );
                });
            });
        });

        describe('when there are forced participants', function () {
            beforeEach(function () {
                this.card1 = { card: 1 };
                this.card2 = { card: 2 };
                this.playerSpy.filterCardsInPlay.and.returnValue([this.card1, this.card2]);
                this.prompt.continue();
            });

            it('prompts with mustSelect', function () {
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                    this.playerSpy,
                    jasmine.objectContaining({
                        mustSelect: [this.card1, this.card2]
                    })
                );
            });

            it('adds a log message', function () {
                expect(this.gameSpy.addMessage).toHaveBeenCalled();
            });
        });

        describe('the select prompt', function () {
            describe('onSelect', function () {
                beforeEach(function () {
                    this.prompt.continue();
                    let call = this.gameSpy.promptForSelect.calls.mostRecent();
                    this.selectPrompt = call.args[1];
                });

                it('calls the onSelect handler with the selected cards', function () {
                    this.selectPrompt.onSelect(this.playerSpy, ['card']);
                    expect(this.onSelectSpy).toHaveBeenCalledWith(['card']);
                });

                describe('and there is an met minimum', function () {
                    beforeEach(function () {
                        // 2 eligible cards in play, a minimum selection of 3 cards, all 2 selected
                        this.playerSpy.getNumberOfCardsInPlay.and.returnValue(2);
                        this.limitsSpy.getMin.and.returnValue(3);

                        this.selectPrompt.onSelect(this.playerSpy, ['card1', 'card2']);
                    });

                    it('does not add an alert', function () {
                        expect(this.gameSpy.addAlert).not.toHaveBeenCalled();
                    });
                });

                describe('and there is an unmet minimum', function () {
                    beforeEach(function () {
                        // 3 eligible cards in play, a minimum selection of 2 cards, only 1 selected
                        this.playerSpy.getNumberOfCardsInPlay.and.returnValue(3);
                        this.limitsSpy.getMin.and.returnValue(2);
                        this.selectPrompt.onSelect(this.playerSpy, ['card']);
                    });

                    it('adds an alert', function () {
                        expect(this.gameSpy.addAlert).toHaveBeenCalled();
                    });
                });
            });
        });
    });
});
