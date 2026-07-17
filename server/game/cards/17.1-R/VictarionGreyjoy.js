import DrawCard from '../../drawcard.js';

class VictarionGreyjoy extends DrawCard {
    setupCardAbilities(ability) {
        this.action({
            title: 'Stand Victarion',
            phase: 'challenge',
            limit: ability.limit.perPhase(2),
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.hasTrait('warship')
            ),
            handler: (context) => {
                this.controller.standCard(this);
                this.game.addMessage(
                    '{0} uses {2} to kneel {1} and stand {2}',
                    this.controller,
                    context.costs.kneel,
                    this
                );
            }
        });
        this.action({
            title: 'Kneel location or gain renown',
            phase: 'challenge',
            cost: ability.costs.kneel(
                (card) => card.getType() === 'location' && card.hasTrait('warship')
            ),
            handler: (context) => {
                this.context = context;

                this.game.promptWithMenu(this.controller, this, {
                    activePrompt: {
                        menuTitle: 'Choose one',
                        buttons: [
                            { text: 'Kneel a location', method: 'kneelLocation' },
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
            cardCondition: (card) => card.location === 'play area' && card.getType() === 'location',
            gameAction: 'kneel',
            onSelect: (player, card) => this.onLocationSelected(player, card),
            onCancel: (player) => this.cancelSelection(player)
        });

        return true;
    }

    gainRenown(player) {
        this.untilEndOfChallenge((ability) => ({
            match: this,
            effect: ability.effects.addKeyword('renown')
        }));

        this.game.addMessage(
            '{0} uses {2} to kneel {1} and have {2} gain renown',
            player,
            this.context.costs.kneel,
            this
        );

        return true;
    }

    onLocationSelected(player, card) {
        card.controller.kneelCard(card);

        this.game.addMessage(
            '{0} uses {1} to kneel {2} and {3}',
            player,
            this,
            this.context.costs.kneel,
            card
        );

        return true;
    }

    cancelSelection(player) {
        this.game.addAlert('danger', '{0} cancels the resolution of {1}', player, this);
    }
}

VictarionGreyjoy.code = '17102';

export default VictarionGreyjoy;
