import BaseAbilityWindow from './BaseAbilityWindow.js';
import { HiddenZones } from '../PossibleResponders.js';
import SelectCardPrompt from './selectcardprompt.js';
import TriggeredAbilityWindowTitles from './TriggeredAbilityWindowTitles.js';

class TriggeredAbilityWindow extends BaseAbilityWindow {
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
        return this.getChoicesFor(player).length > 0;
    }

    getChoicesFor(player) {
        return this.abilityChoices.filter((choice) => choice.player === player);
    }

    /**
     * Whether the player must appear to consider this window although they have nothing to use:
     * a card they could hold in a hidden zone might respond. Since that depends only on public
     * information, a player who really holds one looks the same. A player who paused the waits
     * for the phase is only asked when they hold something, accepting that this shows.
     */
    isPossibleResponder(player) {
        return (
            this.hidesResponsesFor(player) &&
            !player.responsesPausedForPhase &&
            this.game.getPossibleResponders().couldRespond(player, this.abilityType, this.event)
        );
    }

    hidesResponsesFor(player) {
        return this.abilityType === 'reaction' ? player.hideReactions : player.hideInterrupts;
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
                    arg: 'wait',
                    pausesTimer: true
                },
                this.getPauseForPhaseButton()
            ],
            hideDoneButton: true,
            doneButtonText: 'Pass',
            doneButtonFirst: true,
            onCancel: () => this.pass(),
            onMenuCommand: (selectingPlayer, arg) => {
                if (arg === 'wait') {
                    waitForPass = true;
                    prompt.properties.hideDoneButton = false;
                    this.pauseTimer(prompt);
                    return false;
                }

                if (arg === 'passAndPauseForPhase') {
                    this.passAndPauseForPhase(selectingPlayer);
                    return true;
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

    filterPlayers(players) {
        return players.filter(
            (player) =>
                player.isPlaying() &&
                (this.shouldPrompt(player) || this.isPossibleResponder(player))
        );
    }

    promptPlayer(player) {
        let cardsForPlayer = this.getChoicesFor(player).map((choice) => choice.card);

        let unclickableCards = cardsForPlayer.filter((card) => card.location === 'draw deck');
        const pileCards = cardsForPlayer.filter(
            (card, index) =>
                ['discard pile', 'dead pile'].includes(card.location) &&
                cardsForPlayer.findIndex(
                    (other) => other.name === card.name && other.location === card.location
                ) === index
        );
        this.game.promptForSelect(player, {
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(
                this.abilityType,
                this.event.getPrimaryEvents()
            ),
            isCardEffect: false,
            cardCondition: (card) => cardsForPlayer.includes(card),
            cardType: ['agenda', 'attachment', 'character', 'event', 'location', 'plot', 'title'],
            additionalButtons: this.getButtons(player, [...unclickableCards, ...pileCards]),
            additionalControls: this.getAdditionalPromptControls(player),
            doneButtonText: 'Pass',
            onSelect: (player, card) => this.chooseCardToTrigger(player, card),
            onCancel: () => this.pass(),
            onMenuCommand: (player, arg) => {
                if (arg === 'pass') {
                    this.pass();
                } else if (arg === 'passAndPauseForPhase') {
                    this.passAndPauseForPhase(player);
                } else {
                    let card = cardsForPlayer.find((c) => c.uuid === arg);
                    this.chooseCardToTrigger(player, card);
                }

                return true;
            }
        });
    }

    passAndPauseForPhase(player) {
        player.responsesPausedForPhase = true;
        this.game.addMessage('{0} stops response waits for the rest of the phase', player);
        this.pass();
    }

    getPauseForPhaseButton() {
        return { text: "Don't ask again this phase", arg: 'passAndPauseForPhase' };
    }

    getResponseDelayControl(delay) {
        return {
            type: 'response-delay',
            duration: delay,
            abilityWord: TriggeredAbilityWindowTitles.getAbilityWord(this.abilityType)
        };
    }

    pauseTimer(prompt) {
        prompt.properties.additionalControls = prompt.properties.additionalControls.map(
            (control) =>
                control.type === 'response-delay' ? { ...control, paused: true } : control
        );
        prompt.properties.additionalButtons = prompt.properties.additionalButtons.filter(
            (button) => button.arg !== 'wait'
        );
    }

    getButtons(player, listedCards) {
        const buttons = listedCards.map((card) => ({
            text: `${card.name} (${card.location})`,
            card: card,
            mapCard: true
        }));

        if (this.shouldOfferPause(player)) {
            buttons.push(this.getPauseForPhaseButton());
        }

        return buttons;
    }

    shouldOfferPause(player) {
        return (
            !player.responsesPausedForPhase &&
            (this.getChoicesFor(player).some((choice) =>
                HiddenZones.includes(choice.card.location)
            ) ||
                this.game
                    .getPossibleResponders()
                    .couldRespond(player, this.abilityType, this.event))
        );
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
