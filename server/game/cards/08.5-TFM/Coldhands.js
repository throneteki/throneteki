import GameActions from '../../GameActions/index.js';
import DrawCard from '../../drawcard.js';

class Coldhands extends DrawCard {
    // Coldhands (08085)
    // Coldhands cannot be saved.
    // Reaction: After you marshal Coldhands, choose 1 other non-Army character controlled by each
    // player. Remove each of those characters from the game until Coldhands leaves play.
    setupCardAbilities(ability) {
        this.persistentEffect({
            match: this,
            effect: ability.effects.cannotBeSaved()
        });

        this.reaction({
            when: {
                onCardEntersPlay: (event, context) =>
                    event.card === context.source && event.playingType === 'marshal'
            },
            target: {
                cardCondition: (card, context) =>
                    card.location === 'play area' &&
                    card.getType() === 'character' &&
                    !card.hasTrait('Army') &&
                    card !== context.source,
                mode: 'eachPlayer'
            },
            message:
                '{player} uses {source} to remove {target} from the game until {source} leaves play',
            gameAction: GameActions.lastingEffect((context) => ({
                duration: 'custom',
                until: {
                    onCardLeftPlay: (event) => event.card === context.source
                },
                targetController: 'any',
                match: context.target,
                targetLocation: ['play area', 'out of game'],
                effect: ability.effects.removeFromGame()
            }))
        });
    }
}

Coldhands.code = '08085';

export default Coldhands;
