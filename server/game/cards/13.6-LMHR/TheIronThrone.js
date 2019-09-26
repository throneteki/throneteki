const DrawCard = require('../../drawcard');

class TheIronThrone extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneelSelf(),
            handler: () => {
                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Name a card',
                        controls: [
                            { type: 'card-name', command: 'menuButton', method: 'selectCardName' }
                        ]
                    }
                });
            }
        });
    }

    selectCardName(player, cardName) {
        this.game.addMessage('{0} kneels {1} to name {2}', player, this, cardName);
        this.untilEndOfPhase(ability => ({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(card => card.name.toLowerCase() === cardName.toLowerCase()),
                ability.effects.cannotPlay(card => card.name.toLowerCase() === cardName.toLowerCase()),
                ability.effects.cannotPutIntoPlay(card => card.name.toLowerCase() === cardName.toLowerCase())
            ]
        }));
        return true;
    }
}

TheIronThrone.code = '13117';

module.exports = TheIronThrone;
