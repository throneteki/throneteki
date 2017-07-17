const _ = require('underscore');
const uuid = require('uuid');

const BaseAbilityWindow = require('./baseabilitywindow.js');
const TriggeredAbilityWindowTitles = require('./triggeredabilitywindowtitles.js');

class TriggeredAbilityWindow extends BaseAbilityWindow {
    registerAbility(ability, event) {
        let context = ability.createContext(event);
        let player = context.player;
        let choiceTexts = ability.getChoices(context);

        _.each(choiceTexts, choiceText => {
            this.abilityChoices.push({
                id: uuid.v1(),
                player: player,
                ability: ability,
                card: ability.card,
                text: choiceText.text,
                choice: choiceText.choice,
                context: context
            });
        });
    }

    continue() {
        this.players = this.filterChoicelessPlayers(this.players || this.game.getPlayersInFirstPlayerOrder());

        if(this.players.length === 0 || this.abilityChoices.length === 0) {
            return true;
        }

        this.promptPlayer(this.players[0]);

        return false;
    }

    filterChoicelessPlayers(players) {
        return _.filter(players, player => _.any(this.abilityChoices, abilityChoice => this.eligibleChoiceForPlayer(abilityChoice, player)));
    }

    eligibleChoiceForPlayer(abilityChoice, player) {
        return abilityChoice.player === player && abilityChoice.ability.meetsRequirements(abilityChoice.context);
    }

    promptPlayer(player) {
        let choicesForPlayer = this.getChoicesForPlayer(player);
        let buttons = _.map(choicesForPlayer, abilityChoice => {
            let title = abilityChoice.card.name;
            if(abilityChoice.text !== 'default') {
                title += ' - ' + abilityChoice.text;
            }
            return { text: title, method: 'chooseAbility', arg: abilityChoice.id, card: abilityChoice.card };
        });
        buttons.push({ text: 'Pass', method: 'pass' });
        this.game.promptWithMenu(player, this, {
            activePrompt: {
                menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.events[0]),
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponents'
        });
    }

    getChoicesForPlayer(player) {
        let choices = _.filter(this.abilityChoices, abilityChoice => this.eligibleChoiceForPlayer(abilityChoice, player));
        // Cards that have a maximum should only display a single choice by
        // title even if multiple copies are available to be triggered.
        return _.uniq(choices, choice => choice.ability.hasMax() ? choice.card.name : choice);
    }

    chooseAbility(player, id) {
        let choice = _.find(this.abilityChoices, ability => ability.id === id);

        if(!choice || choice.player !== player) {
            return false;
        }

        choice.context.choice = choice.choice;
        this.game.resolveAbility(choice.ability, choice.context);

        this.abilityChoices = _.reject(this.abilityChoices, ability => ability.card === choice.card);

        // Always rotate player order without filtering, in case an ability is
        // triggered that could then make another ability eligible after it is
        // resolved: e.g. Rains of Castamere into Wardens of the West
        this.players = this.rotatedPlayerOrder(player);

        return true;
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

module.exports = TriggeredAbilityWindow;
