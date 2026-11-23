import DropCommand from '../../../server/game/ServerCommands/DropCommand.js';

describe('DropCommand with plots', function () {
    beforeEach(function () {
        this.gameSpy = {
            addAlert: vi.fn(),
            promptWithMenu: vi.fn(),
            queueStep: vi.fn(),
            resolveGameAction: vi.fn(),
            manualActions: { record: vi.fn() }
        };
        this.playerSpy = { moveCard: vi.fn() };
        this.cardSpy = { getType: vi.fn().mockReturnValue('plot'), location: 'plot deck' };
        this.cardSpy.controller = this.cardSpy.owner = this.playerSpy;

        this.drop = (target) => {
            this.command = new DropCommand(this.gameSpy, this.playerSpy, this.cardSpy, target);
            this.result = this.command.execute();
            this.prompt = this.gameSpy.promptWithMenu.mock.calls[0]?.[2];
            this.handlers = this.gameSpy.promptWithMenu.mock.calls[0]?.[1];
        };
        this.methods = () => this.prompt.activePrompt.buttons.map((button) => button.method);
    });

    describe('when a plot from the plot deck is dropped on the used plots', function () {
        beforeEach(function () {
            this.drop('revealed plots');
        });

        it('asks what to do instead of moving it', function () {
            expect(this.playerSpy.moveCard).not.toHaveBeenCalled();
            expect(this.result).toBe(false);
            expect(this.methods()).toEqual(['move', 'reveal', 'cancel']);
        });

        it('moves it to the used plots when asked to', function () {
            this.handlers.move();

            expect(this.gameSpy.resolveGameAction).toHaveBeenCalledTimes(1);
            expect(this.playerSpy.moveCard).not.toHaveBeenCalled();
            expect(this.gameSpy.manualActions.record).toHaveBeenCalledTimes(1);
        });

        it('reveals it when asked to', function () {
            this.handlers.reveal();

            expect(this.gameSpy.queueStep).toHaveBeenCalledTimes(1);
            expect(this.playerSpy.moveCard).not.toHaveBeenCalled();
        });

        it('does nothing when cancelled', function () {
            expect(this.handlers.cancel()).toBe(true);

            expect(this.playerSpy.moveCard).not.toHaveBeenCalled();
            expect(this.gameSpy.queueStep).not.toHaveBeenCalled();
            expect(this.gameSpy.manualActions.record).not.toHaveBeenCalled();
        });
    });

    describe('when a used plot is dropped on the used plots', function () {
        beforeEach(function () {
            this.cardSpy.location = 'revealed plots';
            this.drop('revealed plots');
        });

        it('only offers to reveal it', function () {
            expect(this.methods()).toEqual(['reveal', 'cancel']);
        });
    });

    describe('when a plot is dropped somewhere else', function () {
        beforeEach(function () {
            this.drop('out of game');
        });

        it('moves it without asking', function () {
            expect(this.gameSpy.promptWithMenu).not.toHaveBeenCalled();
            expect(this.playerSpy.moveCard).toHaveBeenCalledWith(this.cardSpy, 'out of game');
        });
    });
});

describe('dropping a plot from the plot deck on the used pile in a game', function () {
    beforeEach(function () {
        this.setupTest({
            phase: 'challenge',
            gameOptions: { manualMode: true },
            player1: {
                faction: 'martell',
                plotDeck: ['A Song of Summer', 'A Noble Cause'],
                inPlay: [{ card: 'House Dayne Knight', attachments: ['Sand Steed'] }]
            }
        });

        this.summer = this.player1.findCardByName('A Song of Summer', 'plot deck');
        this.game.drop(this.player1.name, this.summer.uuid, 'plot deck', 'revealed plots');
        this.game.continue();
    });

    it('moves it only once the player chooses to', function () {
        expect(this.player1).toHavePrompt('Place this plot');
        expect(this.summer.location).toBe('plot deck');

        this.player1.clickPrompt('Move to used plots');

        expect(this.summer.location).toBe('revealed plots');
    });

    it('lets reactions to a plot entering the used pile respond', function () {
        this.player1.clickPrompt('Move to used plots');

        expect(this.player1).toAllowAbilityTrigger('Sand Steed');
        this.player1.triggerAbility('Sand Steed');

        expect(this.houseDayneKnight.power).toBe(1);
        expect(this.player1).isReadyToTakeAction();
    });
});
