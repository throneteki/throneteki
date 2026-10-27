import BaseAbilityWindow from './BaseAbilityWindow.js';
import CancelTimer from './CancelTimer.js';
import SelectCardPrompt from './selectcardprompt.js';
import TriggeredAbilityWindowTitles from './TriggeredAbilityWindowTitles.js';

class TriggeredAbilityWindow extends BaseAbilityWindow {
    constructor(game, properties) {
        super(game, properties);

        this.cancelTimer = new CancelTimer(this.event, this.abilityType);
        this.forceWindowPerPlayer = {};

        for (const player of game.getPlayersInFirstPlayerOrder()) {
            if (this.cancelTimer.isEnabled(player)) {
                this.forceWindowPerPlayer[player.name] = true;
            }
        }
    }

    continue() {
        if (this.hasAttachedEvents()) {
            this.openWindowForAttachedEvents();
            return false;
        }

        this.gatherChoices();

        this.players = this.filterPlayers(this.players || this.game.getPlayersInFirstPlayerOrder());

        while (this.players.length > 0) {
            const player = this.players[0];

            if (this.shouldPrompt(player)) {
                this.promptPlayer(player);
                return false;
            }

            if (this.isPossibleResponder(player)) {
                this.promptPossibleResponder(player);
                return false;
            }

            this.players.shift();
        }

        return true;
    }

    shouldPrompt(player) {
        return (
            !!this.forceWindowPerPlayer[player.name] ||
            this.abilityChoices.some((choice) => choice.player === player) ||
            (this.abilityChoices.length > 0 && this.cancelTimer.isEnabled(player))
        );
    }

    /**
     * Whether the player must appear to consider this window although they have nothing to use:
     * the timer doesn't cover it, and a card they could hold in a hidden zone might respond. Since
     * that depends only on public information, a player who really holds one looks the same.
     */
    isPossibleResponder(player) {
        return (
            !this.cancelTimer.isEnabled(player) &&
            this.game.getPossibleResponders().couldRespond(player, this.abilityType, this.event)
        );
    }

    promptPossibleResponder(player) {
        const delay = this.game.responseDelay();
        let waitForPass = false;
        const prompt = new SelectCardPrompt(this.game, player, {
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(
                this.abilityType,
                this.event.getPrimaryEvents()
            ),
            isCardEffect: false,
            cardCondition: () => false,
            cardType: ['agenda', 'attachment', 'character', 'event', 'location', 'plot', 'title'],
            additionalControls: [
                this.getResponseDelayControl(delay),
                ...this.getAdditionalPromptControls(player)
            ],
            additionalButtons: [
                {
                    text: 'Wait',
                    arg: 'wait'
                }
            ],
            doneButtonText: 'Skip',
            onCancel: () => this.pass(),
            onMenuCommand: (selectingPlayer, arg) => {
                if (arg === 'wait') {
                    waitForPass = true;
                    prompt.properties.doneButtonText = 'Pass';
                    this.removeTimer(prompt);
                    return false;
                }

                return false;
            }
        });

        this.game.queueStep(prompt);
        this.game.afterDelay(delay, () => {
            if (!prompt.isComplete() && !waitForPass) {
                prompt.onMenuCommand(player, 'done');
            }
        });
    }

    /**
     * Filters out players who are no longer playing, have paused the timer for this window, or
     * have no valid choices
     */
    filterPlayers(players) {
        return players.filter(
            (player) =>
                player.isPlaying() &&
                !this.cancelTimer.isPausedFor(player) &&
                (this.cancelTimer.isEnabled(player) ||
                    this.abilityChoices.some((abilityChoice) => abilityChoice.player === player) ||
                    this.isPossibleResponder(player))
        );
    }

    promptPlayer(player) {
        let cardsForPlayer = this.abilityChoices
            .filter((choice) => choice.player === player)
            .map((choice) => choice.card);

        let unclickableCards = cardsForPlayer.filter((card) => card.location === 'draw deck');
        const timed = this.cancelTimer.isEnabled(player);
        const delay = timed ? player.getWindowTimerDelay() : undefined;
        let timerStopped = false;

        const prompt = this.game.promptForSelect(player, {
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(
                this.abilityType,
                this.event.getPrimaryEvents()
            ),
            isCardEffect: false,
            cardCondition: (card) => cardsForPlayer.includes(card),
            cardType: ['agenda', 'attachment', 'character', 'event', 'location', 'plot', 'title'],
            additionalButtons: this.getButtons(player, unclickableCards),
            additionalControls: [
                ...(timed ? [this.getResponseDelayControl(delay)] : []),
                ...this.getAdditionalPromptControls(player)
            ],
            doneButtonText: 'Pass',
            onSelect: (player, card) => this.chooseCardToTrigger(player, card),
            onCancel: () => this.pass(),
            onMenuCommand: (player, arg) => {
                if (arg === 'stopTimer') {
                    timerStopped = true;
                    this.removeTimer(prompt);
                    return false;
                }

                if (arg === 'pass') {
                    this.pass();
                } else if (arg === 'passAndPauseForRound') {
                    player.disableTimerForRound();
                    this.pass();
                } else {
                    let card = cardsForPlayer.find((c) => c.uuid === arg);
                    this.chooseCardToTrigger(player, card);
                }

                return true;
            }
        });

        if (timed) {
            this.game.afterDelay(delay, () => {
                if (!prompt.isComplete() && !timerStopped) {
                    prompt.onMenuCommand(player, 'pass');
                }
            });
        }

        this.forceWindowPerPlayer[player.name] = false;
    }

    getResponseDelayControl(delay) {
        return {
            type: 'response-delay',
            duration: delay,
            abilityWord: TriggeredAbilityWindowTitles.getAbilityWord(this.abilityType)
        };
    }

    removeTimer(prompt) {
        prompt.properties.additionalControls = prompt.properties.additionalControls.filter(
            (control) => control.type !== 'response-delay'
        );
        prompt.properties.additionalButtons = prompt.properties.additionalButtons.filter(
            (button) => !['stopTimer', 'wait'].includes(button.arg)
        );
    }

    getButtons(player, unclickableCards) {
        let buttons = unclickableCards.map((card) => {
            return { text: `${card.name} (${card.location})`, card: card, mapCard: true };
        });

        if (this.cancelTimer.isEnabled(player)) {
            buttons.push({ text: 'I need more time', arg: 'stopTimer' });
            buttons.push({
                text: "Don't ask again until end of round",
                arg: 'passAndPauseForRound'
            });
        }

        return buttons;
    }

    getAdditionalPromptControls(player) {
        let controls = [];
        for (let event of this.event.getConcurrentEvents()) {
            if (event.name === 'onCardAbilityInitiated' && event.targets.length > 0) {
                controls.push({
                    type: 'targeting',
                    source: event.source.getShortSummary(),
                    targets: this.buildTargetSummaries(
                        player,
                        event.targets,
                        event.targetsToValidate
                    )
                });
            } else if (event.name === 'onTargetsChosen') {
                controls.push({
                    type: 'targeting',
                    source: event.ability.card.getShortSummary(),
                    targets: this.buildTargetSummaries(
                        player,
                        event.targets.getTargets(),
                        event.targets.getTargetsToValidate()
                    )
                });
            }
        }

        return controls;
    }

    buildTargetSummaries(player, targets, targetsToValidate) {
        return targets.map((target) =>
            target.getShortSummary(
                targetsToValidate.includes(target) || this.game.isCardVisible(target, player)
            )
        );
    }

    chooseCardToTrigger(player, card) {
        let choices = this.abilityChoices.filter(
            (choice) => choice.player === player && choice.card === card
        );

        if (choices.length === 0) {
            return false;
        }

        // Map all selectable cards to the ability that selection will choose
        const choiceCardsMap = this.mapToCards(choices);

        if (choices.length === 1 || choiceCardsMap.size <= 1) {
            this.chooseAbility(choices[0]);
            return true;
        }

        const availableTargets = [...choiceCardsMap.keys()];
        this.game.promptForSelect(player, {
            activePromptTitle: `Choose triggering card for ${card.name}`,
            isCardEffect: false,
            cardCondition: (card) => availableTargets.includes(card),
            onSelect: (player, selectedCard) => {
                const choice = choiceCardsMap.get(selectedCard);

                if (!choice || choice.player !== player) {
                    return false;
                }

                this.chooseAbility(choice);

                return true;
            }
        });

        return true;
    }

    mapToCards(choices) {
        const getCardFromEvent = (event) => event.card || event.target;
        return choices.reduce((map, choice) => {
            const cards = choice.context.aggregate
                ? choice.context.events.map(getCardFromEvent)
                : [getCardFromEvent(choice.context.event)];

            // Map each selectable card to it's relevant choice
            for (const card of cards.filter((card) => !!card)) {
                map.set(card, choice);
            }
            return map;
        }, new Map());
    }

    chooseAbility(choice) {
        this.resolveAbility(choice.ability, choice.context);

        // Always rotate player order without filtering, in case an ability is
        // triggered that could then make another ability eligible after it is
        // resolved: e.g. Rains of Castamere into Wardens of the West
        this.players = this.rotatedPlayerOrder(choice.player);
    }

    pass() {
        this.players.shift();
        return true;
    }

    rotatedPlayerOrder(player) {
        let players = this.game.getPlayersInFirstPlayerOrder();
        let splitIndex = players.indexOf(player);
        let beforePlayer = players.slice(0, splitIndex);
        let afterPlayer = players.slice(splitIndex + 1);
        return afterPlayer.concat(beforePlayer).concat([player]);
    }
}

export default TriggeredAbilityWindow;
