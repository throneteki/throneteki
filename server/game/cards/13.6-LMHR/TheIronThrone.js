const DrawCard = require('../../drawcard');

class TheIronThrone extends DrawCard {
    setupCardAbilities(ability) {
        this.reaction({
            when: {
                onPhaseStarted: () => true
            },
            cost: ability.costs.kneelSelf(),
            handler: (context) => {
                this.game.promptForCardName({
                    player: context.player,
                    onSelect: (player, cardName) => this.selectCardName(player, cardName),
                    source: context.source
                });
            }
        });
    }

    selectCardName(player, cardName) {
        this.game.addMessage('{0} kneels {1} to name {2}', player, this, cardName);
        this.untilEndOfPhase((ability) => ({
            targetController: 'any',
            effect: [
                ability.effects.cannotMarshal(
                    (card) => card.name.toLowerCase() === cardName.toLowerCase()
                ),
                ability.effects.cannotPlay(
                    (card) => card.name.toLowerCase() === cardName.toLowerCase()
                ),
                ability.effects.cannotPutIntoPlay(
                    (card) => card.name.toLowerCase() === cardName.toLowerCase()
                )
            ]
        }));
    }
}

TheIronThrone.code = '13117';

module.exports = TheIronThrone;
