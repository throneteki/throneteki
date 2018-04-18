const _ = require('underscore');
const uuid = require('uuid');

const BaseAbilityWindow = require('./BaseAbilityWindow');
const CancelTimer = require('./CancelTimer');
const TriggeredAbilityWindowTitles = require('./TriggeredAbilityWindowTitles');

class TriggeredAbilityWindow extends BaseAbilityWindow {
    constructor(game, properties) {
        super(game, properties);

        this.cancelTimer = new CancelTimer(this.event, this.abilityType);
        this.forceWindowPerPlayer = {};

        for(let player of game.getPlayersInFirstPlayerOrder()) {
            if(this.cancelTimer.isEnabled(player)) {
                this.forceWindowPerPlayer[player.name] = true;
            }
        }
    }

    continue() {
        this.gatherChoices();

        this.players = this.filterChoicelessPlayers(this.players || this.game.getPlayersInFirstPlayerOrder());

        if(this.players.length === 0 || this.abilityChoices.length === 0 && !this.forceWindowPerPlayer[this.players[0].name]) {
            return true;
        }

        this.promptPlayer(this.players[0]);

        return false;
    }

    filterChoicelessPlayers(players) {
        return players.filter(player => this.cancelTimer.isEnabled(player) || this.abilityChoices.some(abilityChoice => this.eligibleChoiceForPlayer(abilityChoice, player)));
    }

    eligibleChoiceForPlayer(abilityChoice, player) {
        return abilityChoice.player === player && abilityChoice.ability.meetsRequirements(abilityChoice.context);
    }

    promptPlayer(player) {
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.event.getPrimaryEvent()),
                buttons: this.getButtons(player),
                controls: this.getAdditionalPromptControls()
            },
            waitingPromptTitle: 'Waiting for opponents'
        });

        this.forceWindowPerPlayer[player.name] = false;
    }

    getButtons(player) {
        let choicesForPlayer = this.getChoicesForPlayer(player);
        let cardsWithChoices = [... new Set(choicesForPlayer.map(choice => choice.card))];
        let buttons = cardsWithChoices.map(card => {
            let text = card.name;
            let choicesForCard = choicesForPlayer.filter(choice => choice.card === card);
            if(choicesForCard.some(choice => !choice.ability.location.includes(card.location))) {
                text += ` (${card.location})`;
            }
            return { text: text, method: 'chooseCardToTrigger', arg: card.uuid };
        });

        if(this.cancelTimer.isEnabled(player)) {
            buttons.push({ timer: true, method: 'pass', id: uuid.v1() });
            buttons.push({ text: 'I need more time', timerCancel: true });
            buttons.push({ text: 'Don\'t ask again until end of round', timerCancel: true, method: 'pass', arg: 'pauseRound' });
        }

        buttons.push({ text: 'Pass', method: 'pass' });

        return buttons;
    }

    getAdditionalPromptControls() {
        let controls = [];
        for(let event of this.event.getConcurrentEvents()) {
            if(event.name === 'onCardAbilityInitiated' && event.targets.length > 0) {
                controls.push({
                    type: 'targeting',
                    source: event.source.getShortSummary(),
                    targets: event.targets.map(target => target.getShortSummary())
                });
            }
        }

        return controls;
    }

    getChoicesForPlayer(player) {
        let choices = this.abilityChoices.filter(abilityChoice => {
            try {
                return this.eligibleChoiceForPlayer(abilityChoice, player);
            } catch(e) {
                this.abilityChoices = this.abilityChoices.filter(a => a !== abilityChoice);
                this.game.reportError(e);
                return false;
            }
        });
        // Cards that have a maximum should only display a single choice by
        // title even if multiple copies are available to be triggered.
        return _.uniq(choices, choice => choice.ability.hasMax() ? choice.card.name : choice);
    }

    chooseCardToTrigger(player, cardUuid) {
        let choices = this.abilityChoices.filter(choice => choice.player === player && choice.card.uuid === cardUuid);

        if(choices.length === 0) {
            return false;
        }

        if(choices.length === 1) {
            this.chooseAbility(choices[0]);
            return true;
        }

        let card = choices[0].card;
        let availableTargets = choices.map(choice => choice.context.event.card || choice.context.event.target);

        this.game.promptForSelect(player, {
            activePromptTitle: `Choose target for ${card.name}`,
            cardCondition: card => availableTargets.includes(card),
            onSelect: (player, selectedCard) => {
                let choice = choices.find(choice => choice.context.event.card === selectedCard || choice.context.event.target === selectedCard);

                if(!choice || choice.player !== player) {
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

    pass(player, arg) {
        if(arg === 'pauseRound') {
            player.disableTimerForRound();
        }

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

module.exports = TriggeredAbilityWindow;
