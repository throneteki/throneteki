import PossibleResponders from '../../../server/game/PossibleResponders.js';
import { deckBuilder } from '../../helpers/cards.js';

describe('cancel windows for a player without the timer', function () {
    function setup(context, { player2Hand = [], pool = ["The Hand's Judgment", 'Hear Me Roar!'] }) {
        context.setupTest({
            phase: 'challenge',
            player1: { faction: 'lannister', hand: ['Hear Me Roar!', 'Lannisport Merchant'] },
            player2: { faction: 'stark', gold: 5, hand: player2Hand }
        });

        context.game.possibleResponders = new PossibleResponders(context.game, {
            cardData: pool.map((name) => deckBuilder.getCard(name))
        });
        context.scheduled = [];
        context.game.schedule = (delay, callback) => context.scheduled.push({ delay, callback });
        context.stateSent = 0;
        context.game.on('sendGameState', () => context.stateSent++);
    }

    function playRoar(context) {
        context.player1.clickCard(context.hearMeRoar);
        context.player1.clickCard(context.lannisportMerchant);
    }

    const WindowTitle = 'Any interrupts to the effects of Hear Me Roar!?';

    // What the event's player can see of the window: their own prompt, and whether their
    // opponent's prompt is active.
    function opponentView(context) {
        return {
            prompt: context.player1.formatPrompt(),
            opponentActive: context.player2.player.getState(context.player1.player).isActivePrompt
        };
    }

    const ViewWhileConsidering = { prompt: 'Waiting for opponent\n', opponentActive: true };

    describe('when a card they could hold might cancel the event', function () {
        describe('and they hold one', function () {
            beforeEach(function () {
                setup(this, { player2Hand: ["The Hand's Judgment"] });
                playRoar(this);
            });

            it('looks the same to their opponent as when they hold none', function () {
                expect(opponentView(this)).toEqual(ViewWhileConsidering);
            });

            it('prompts them to use it, without passing for them', function () {
                expect(this.player2).toHavePrompt(WindowTitle);
                expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
                expect(this.scheduled).toHaveLength(0);
            });
        });

        describe('and they hold none', function () {
            beforeEach(function () {
                setup(this, {});
                playRoar(this);
            });

            it('looks the same to their opponent as when they hold one', function () {
                expect(opponentView(this)).toEqual(ViewWhileConsidering);
            });

            it('shows Wait and the button to stop being asked this phase, without Skip', function () {
                expect(this.player2.player.promptState.buttons.map((b) => b.text)).toEqual([
                    'Wait',
                    "Don't ask again this phase"
                ]);
            });

            it('shows them the same window, with nothing to choose', function () {
                expect(this.player2).toHavePrompt(WindowTitle);
                expect(this.player2).toHavePromptButton('Wait');
                expect(this.player2.player.promptState.controls).toContainEqual(
                    expect.objectContaining({
                        type: 'response-delay',
                        duration: this.scheduled[0].delay
                    })
                );
                expect(this.player2.player.getState(this.player1.player).controls).toBeUndefined();
                expect(this.player2.player.promptState.isActivePrompt).toBe(true);
                expect(this.lannisportMerchant.location).toBe('hand');
            });

            it('names the kind of ability the window is for', function () {
                expect(this.player2.player.promptState.controls).toContainEqual(
                    expect.objectContaining({ type: 'response-delay', abilityWord: 'interrupt' })
                );
            });

            it('passes for them after a short random delay', function () {
                expect(this.scheduled).toHaveLength(1);
                expect(this.scheduled[0].delay).toBeGreaterThanOrEqual(3000);
                expect(this.scheduled[0].delay).toBeLessThan(5000);

                this.scheduled[0].callback();

                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.stateSent).toBe(1);
                expect(this.player1).isReadyToTakeAction();
            });

            it('lets them stop being asked for the rest of the phase', function () {
                this.player2.clickPrompt("Don't ask again this phase");

                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.player2.player.responsesPausedForPhase).toBe(true);

                this.scheduled[0].callback();

                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.player1).isReadyToTakeAction();
            });

            it('lets them wait for an explicit pass instead of timing out', function () {
                this.player2.clickPrompt('Wait');

                expect(this.player2).toHavePromptButton('Pass');
                expect(this.player2).not.toHavePromptButton('Wait');
                expect(this.player2.player.promptState.controls).toContainEqual(
                    expect.objectContaining({ type: 'response-delay', paused: true })
                );

                this.scheduled[0].callback();

                expect(this.lannisportMerchant.location).toBe('hand');
                expect(this.player2).toHavePrompt(WindowTitle);

                this.player2.clickPrompt('Pass');

                expect(this.lannisportMerchant.location).toBe('play area');
                expect(this.player1).isReadyToTakeAction();
            });
        });
    });

    describe('in a reaction window', function () {
        function setupReaction(context, player2Hand, player2Settings = {}) {
            context.setupTest({
                phase: 'marshal',
                player2: { gold: 5, hand: player2Hand }
            });

            context.game.possibleResponders = new PossibleResponders(context.game, {
                cardData: [deckBuilder.getCard("Lysa's Letter")]
            });
            context.scheduled = [];
            context.game.schedule = (delay, callback) =>
                context.scheduled.push({ delay, callback });
            Object.assign(context.player2.player, player2Settings);

            context.player1.clickPrompt('Done');
            context.player2.clickPrompt('Done');

            // The first player could hold the reaction too, so they consider the window first.
            expect(context.scheduled).toHaveLength(1);
            context.scheduled.shift().callback();
        }

        const ReactionView = { prompt: 'Waiting for opponent\n', opponentActive: true };

        describe('when they hold a reaction', function () {
            beforeEach(function () {
                setupReaction(this, ["Lysa's Letter"]);
            });

            it('prompts them to use it', function () {
                expect(this.player2).toAllowAbilityTrigger("Lysa's Letter");
                expect(this.scheduled).toHaveLength(0);
                expect(opponentView(this)).toEqual(ReactionView);
            });
        });

        describe('when they hold none', function () {
            beforeEach(function () {
                setupReaction(this, []);
            });

            it('gives them a fake wait that looks the same to their opponent', function () {
                expect(this.scheduled).toHaveLength(1);
                expect(opponentView(this)).toEqual(ReactionView);

                this.scheduled.shift().callback();

                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when they turn off hiding whether they have reactions', function () {
            beforeEach(function () {
                setupReaction(this, [], { hideReactions: false });
            });

            it('skips the window', function () {
                expect(this.scheduled).toHaveLength(0);
                expect(this.player1).isReadyToTakeAction();
            });
        });

        describe('when they only turn off hiding whether they have interrupts', function () {
            beforeEach(function () {
                setupReaction(this, [], { hideInterrupts: false });
            });

            it('still gives them a fake wait', function () {
                expect(this.scheduled).toHaveLength(1);
            });
        });
    });

    describe('during setup', function () {
        beforeEach(function () {
            this.setupTest({
                phase: 'setup',
                player1: { faction: 'greyjoy', hand: ['Iron Fleet Scout'] },
                player2: { faction: 'greyjoy' }
            });

            this.game.possibleResponders = new PossibleResponders(this.game, {
                cardData: [deckBuilder.getCard('Eager Deckhand')]
            });
            this.scheduled = [];
            this.game.schedule = (delay, callback) => this.scheduled.push({ delay, callback });

            this.player1.clickCard(this.ironFleetScout);
        });

        it('does not open a window for cards set up', function () {
            expect(this.scheduled).toHaveLength(0);
            expect(this.player1).toHavePrompt('Select setup cards');
            expect(this.player2).toHavePrompt('Select setup cards');
        });
    });

    describe('when no card they could hold might cancel the event', function () {
        beforeEach(function () {
            setup(this, { pool: ['Hear Me Roar!'] });
            playRoar(this);
        });

        it('skips the window', function () {
            expect(this.scheduled).toHaveLength(0);
            expect(this.lannisportMerchant.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });
    });

    describe('when they turn off hiding whether they have interrupts', function () {
        it('skips the window when they hold none', function () {
            setup(this, {});
            this.player2.player.hideInterrupts = false;
            playRoar(this);

            expect(this.scheduled).toHaveLength(0);
            expect(this.lannisportMerchant.location).toBe('play area');
            expect(this.player1).isReadyToTakeAction();
        });

        it('still prompts them when they hold one', function () {
            setup(this, { player2Hand: ["The Hand's Judgment"] });
            this.player2.player.hideInterrupts = false;
            playRoar(this);

            expect(this.player2).toAllowAbilityTrigger("The Hand's Judgment");
        });
    });

    describe('when they only turn off hiding whether they have reactions', function () {
        it('still gives them a fake wait in an interrupt window', function () {
            setup(this, {});
            this.player2.player.hideReactions = false;
            playRoar(this);

            expect(this.scheduled).toHaveLength(1);
            expect(this.player2).toHavePrompt(WindowTitle);
        });
    });
});
