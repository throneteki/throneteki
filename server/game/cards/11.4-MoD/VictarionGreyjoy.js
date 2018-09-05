const DrawCard = require('../../drawcard');

class VictarionGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Kneel a warship location',
            phase: 'challenge',
            cost: ability.costs.kneel(card => card.getType() === 'location' && card.hasTrait('warship')),
            handler: context => {
                this.context = context;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Kneel a location', method: 'kneelLocation' },
                            { text: 'Stand Victarion', method: 'standVictarion' },
                            { text: 'Gain renown', method: 'gainRenown' }
                        ]
                    },
                    source: this
                });
            }
        });
    }

    kneelLocation() {
        this.game.promptForSelect(this.controller, {
            activePromptTitle: 'Select a location',
            source: this,
            cardCondition: card => card.getType() === 'location',
            gameAction: 'kneel',
            onSelect: (player, card) => this.onLocationSelected(player, card),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    standVictarion(player) {
        this.controller.standCard(this);

        this.game.addMessage('{0} uses {1} to stand {1}', player, this);

        return true;
    }

    gainRenown() {
        this.untilEndOfChallenge(ability => ({
            match: this,
            effect: ability.effects.addKeyword('renown')
        }));

        return true;
    }

    onLocationSelected(player, card) {
        card.controller.kneelCard(card);

        this.game.addMessage('{0} uses {1} to kneel {2}', player, this, card);

        return true;
    }

    cancelSelection(player) {
        this.game.addMessage('{0} cancels the resolution of {1}', player, this);
    }
}

VictarionGreyjoy.code = '11071';

module.exports = VictarionGreyjoy;
