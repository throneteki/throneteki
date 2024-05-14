import uuid from 'uuid';
import BaseAbilityWindow from './BaseAbilityWindow.js';
import CancelTimer from './CancelTimer.js';
import TriggeredAbilityWindowTitles from './TriggeredAbilityWindowTitles.js';

class TriggeredAbilityWindow extends BaseAbilityWindow {
    constructor(game, properties) {
        super(game, properties);

        this.cancelTimer = new CancelTimer(this.event, this.abilityType);
        this.forceWindowPerPlayer = {};

        for (let player of game.getPlayersInFirstPlayerOrder()) {
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

        this.players = this.filterChoicelessPlayers(
            this.players || this.game.getPlayersInFirstPlayerOrder()
        );

        if (
            this.players.length === 0 ||
            (this.abilityChoices.length === 0 && !this.forceWindowPerPlayer[this.players[0].name])
        ) {
            return true;
        }

        this.promptPlayer(this.players[0]);

        return false;
    }

    filterChoicelessPlayers(players) {
        return players.filter(
            (player) =>
                this.cancelTimer.isEnabled(player) ||
                this.abilityChoices.some((abilityChoice) => abilityChoice.player === player)
        );
    }

    promptPlayer(player) {
        let cardsForPlayer = this.abilityChoices
            .filter((choice) => choice.player === player)
            .map((choice) => choice.card);

        let unclickableCards = cardsForPlayer.filter((card) => card.location === 'draw deck');

        this.game.promptForSelect(player, {
            activePromptTitle: TriggeredAbilityWindowTitles.getTitle(
                this.abilityType,
                this.event.getPrimaryEvents()
            ),
            isCardEffect: false,
            cardCondition: (card) => cardsForPlayer.includes(card),
            cardType: ['agenda', 'attachment', 'character', 'event', 'location', 'plot', 'title'],
            additionalButtons: this.getButtons(player, unclickableCards),
            additionalControls: this.getAdditionalPromptControls(player),
            doneButtonText: 'Pass',
            onSelect: (player, card) => this.chooseCardToTrigger(player, card),
            onCancel: () => this.pass(),
            onMenuCommand: (player, arg) => {
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

        this.forceWindowPerPlayer[player.name] = false;
    }

    getButtons(player, unclickableCards) {
        let buttons = unclickableCards.map((card) => {
            return { text: `${card.name} (${card.location})`, card: card, mapCard: true };
        });

        if (this.cancelTimer.isEnabled(player)) {
            buttons.push({ timer: true, arg: 'pass', id: uuid.v1() });
            buttons.push({ text: 'I need more time', timerCancel: true });
            buttons.push({
                text: "Don't ask again until end of round",
                timerCancel: true,
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

        let availableTargets = choices
            .map((choice) => choice.context.event.card || choice.context.event.target)
            .filter((card) => !!card);

        if (choices.length === 1 || availableTargets.length <= 1) {
            this.chooseAbility(choices[0]);
            return true;
        }

        this.game.promptForSelect(player, {
            activePromptTitle: `Choose triggering card for ${card.name}`,
            isCardEffect: false,
            cardCondition: (card) => availableTargets.includes(card),
            onSelect: (player, selectedCard) => {
                let choice = choices.find(
                    (choice) =>
                        choice.context.event.card === selectedCard ||
                        choice.context.event.target === selectedCard
                );

                if (!choice || choice.player !== player) {
                    return false;
                }

                this.chooseAbility(choice);

                return true;
            }
        });

        return true;
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
