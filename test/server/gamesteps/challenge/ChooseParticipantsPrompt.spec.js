import ChooseParticipantsPrompt from '../../../../server/game/gamesteps/challenge/ChooseParticipantsPrompt.js';

describe('ChooseParticipantsPrompt', function () {
    beforeEach(function () {
        this.gameSpy = { addAlert: vi.fn(), addMessage: vi.fn(), promptForSelect: vi.fn() };
        this.limitsSpy = { getMax: vi.fn(), getMin: vi.fn() };
        this.limitsSpy.getMax.mockReturnValue(0);
        this.limitsSpy.getMin.mockReturnValue(0);
        this.playerSpy = { getNumberOfCardsInPlay: vi.fn(), filterCardsInPlay: vi.fn() };
        this.playerSpy.getNumberOfCardsInPlay.mockReturnValue(10);
        this.playerSpy.filterCardsInPlay.mockReturnValue([]);
        this.playerSpy.genericLimits = this.limitsSpy;
        this.onSelectSpy = vi.fn();
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
                    expect.objectContaining({
                        activePromptTitle: 'Select participants',
                        waitingPromptTitle: 'Waiting for opponent to declare participants'
                    })
                );
            });

            describe('when there is a minimum number of participants', function () {
                beforeEach(function () {
                    this.limitsSpy.getMin.mockReturnValue(23);
                });

                it('adds the requirement to the prompt title', function () {
                    this.prompt.continue();
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.playerSpy,
                        expect.objectContaining({
                            activePromptTitle: 'Select participants (min 23)'
                        })
                    );
                });
            });

            describe('when there is a maximum number of participants', function () {
                beforeEach(function () {
                    this.limitsSpy.getMax.mockReturnValue(45);
                });

                it('adds the requirement to the prompt title', function () {
                    this.prompt.continue();
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.playerSpy,
                        expect.objectContaining({
                            activePromptTitle: 'Select participants (max 45)'
                        })
                    );
                });

                it('limits the number of cards that can be selected', function () {
                    this.prompt.continue();
                    expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                        this.playerSpy,
                        expect.objectContaining({
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
                this.playerSpy.filterCardsInPlay.mockReturnValue([this.card1, this.card2]);
                this.prompt.continue();
            });

            it('prompts with mustSelect', function () {
                expect(this.gameSpy.promptForSelect).toHaveBeenCalledWith(
                    this.playerSpy,
                    expect.objectContaining({
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
                    let call = this.gameSpy.promptForSelect.mock.lastCall;
                    this.selectPrompt = call[1];
                });

                it('calls the onSelect handler with the selected cards', function () {
                    this.selectPrompt.onSelect(this.playerSpy, ['card']);
                    expect(this.onSelectSpy).toHaveBeenCalledWith(['card']);
                });

                describe('and there is an met minimum', function () {
                    beforeEach(function () {
                        // 2 eligible cards in play, a minimum selection of 3 cards, all 2 selected
                        this.playerSpy.getNumberOfCardsInPlay.mockReturnValue(2);
                        this.limitsSpy.getMin.mockReturnValue(3);

                        this.selectPrompt.onSelect(this.playerSpy, ['card1', 'card2']);
                    });

                    it('does not add an alert', function () {
                        expect(this.gameSpy.addAlert).not.toHaveBeenCalled();
                    });
                });

                describe('and there is an unmet minimum', function () {
                    beforeEach(function () {
                        // 3 eligible cards in play, a minimum selection of 2 cards, only 1 selected
                        this.playerSpy.getNumberOfCardsInPlay.mockReturnValue(3);
                        this.limitsSpy.getMin.mockReturnValue(2);
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
