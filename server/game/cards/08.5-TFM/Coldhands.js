const DrawCard = require('../../drawcard.js');

class Coldhands extends DrawCard {
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.reaction({
            when: {
                onCardEntersPlay: event => event.card === this && event.playingType === 'marshal'
            },
            //TODO Melee: needs a target controlled by each player
            targets: {
                ownCharacter: {
                    cardCondition: card => this.nonArmyCharacterInPlay(card) && card.controller === this.controller
                },
                opponentCharacter: {
                    cardCondition: card => this.nonArmyCharacterInPlay(card) && card.controller !== this.controller
                }
            },
            handler: context => {
                let targets = [context.targets.ownCharacter, context.targets.opponentCharacter];

                this.lastingEffect(ability => ({
                    until: {
                        onCardLeftPlay: event => event.card === this
                    },
                    targetController: 'any',
                    match: card => targets.includes(card),
                    effect: ability.effects.removeFromGame()
                }));

                this.game.addMessage('{0} uses {1} to remove {2} from the game until {1} leaves play',
                    context.player, this, targets);
            }
        });
    }

    nonArmyCharacterInPlay(card) {
        return card.location === 'play area' && card.getType() === 'character' && !card.hasTrait('Army') && card !== this;
    }
}

Coldhands.code = '08085';

module.exports = Coldhands;
