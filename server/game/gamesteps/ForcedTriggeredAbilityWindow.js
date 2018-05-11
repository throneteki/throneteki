const BaseAbilityWindow = require('./BaseAbilityWindow');
const TriggeredAbilityWindowTitles = require('./TriggeredAbilityWindowTitles');

class ForcedTriggeredAbilityWindow extends BaseAbilityWindow {
    continue() {
        if(this.hasAttachedEvents()) {
            this.openWindowForAttachedEvents();
            return false;
        }

        this.gatherChoices();

        if(this.abilityChoices.length === 1) {
            let abilityChoice = this.abilityChoices[0];
            this.resolveAbility(abilityChoice.ability, abilityChoice.context);
            return false;
        }

        if(this.abilityChoices.length > 1) {
            this.promptPlayer();
            return false;
        }

        return true;
    }

    promptPlayer() {
        let buttons = this.abilityChoices
            .map(abilityChoice => {
                let title = abilityChoice.player.name + ' - ' + abilityChoice.card.name;
                return { text: title, method: 'chooseAbility', arg: abilityChoice.id, card: abilityChoice.card };
            })
            .sort((a, b) => a.text > b.text ? 1 : -1);

        this.game.promptWithMenu(this.game.getFirstPlayer(), this, {
            activePrompt: {
                menuTitle: TriggeredAbilityWindowTitles.getTitle(this.abilityType, this.event.getPrimaryEvent()),
                buttons: buttons
            },
            waitingPromptTitle: 'Waiting for opponents to resolve forced abilities'
        });
    }

    chooseAbility(player, id) {
        let choice = this.abilityChoices.find(ability => ability.id === id);

        if(!choice) {
            return false;
        }
        if(this.abilityType === 'whenrevealed') {
            this.game.addMessage('{0} has chosen to resolve first the when revealed ability of {1}\'s {2}',
                player, choice.player.name, choice.card);
        }

        this.resolveAbility(choice.ability, choice.context);

        return true;
    }
}

module.exports = ForcedTriggeredAbilityWindow;
